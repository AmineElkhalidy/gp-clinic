import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"

// GET /api/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay() + 1)
    startOfWeek.setHours(0, 0, 0, 0)

    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date(now)
    todayEnd.setHours(23, 59, 59, 999)

    // Run all queries in parallel
    const [
      totalPatients,
      newPatientsThisMonth,
      appointmentsThisWeek,
      todayAppointments,
      consultationsThisMonth,
      monthlyRevenue,
      monthlyExpenses,
      pendingInvoices,
      recentPatients,
      upcomingAppointments,
    ] = await Promise.all([
      // Total patients
      prisma.patient.count(),

      // New patients this month
      prisma.patient.count({
        where: { createdAt: { gte: startOfMonth } },
      }),

      // Appointments this week
      prisma.appointment.count({
        where: {
          dateTime: { gte: startOfWeek },
          status: { notIn: ["CANCELLED"] },
        },
      }),

      // Today's appointments
      prisma.appointment.findMany({
        where: {
          dateTime: { gte: todayStart, lte: todayEnd },
          status: { notIn: ["CANCELLED"] },
        },
        orderBy: { dateTime: "asc" },
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),

      // Consultations this month
      prisma.consultation.count({
        where: { date: { gte: startOfMonth } },
      }),

      // Monthly revenue (paid invoices)
      prisma.invoice.aggregate({
        where: {
          date: { gte: startOfMonth },
          paymentStatus: "PAID",
        },
        _sum: { total: true },
      }),

      // Monthly expenses
      prisma.expense.aggregate({
        where: { date: { gte: startOfMonth } },
        _sum: { amount: true },
      }),

      // Pending invoices
      prisma.invoice.aggregate({
        where: { paymentStatus: "PENDING" },
        _sum: { total: true },
        _count: true,
      }),

      // Recent patients
      prisma.patient.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
        },
      }),

      // Upcoming appointments (next 7 days)
      prisma.appointment.findMany({
        where: {
          dateTime: { gte: now },
          status: { in: ["SCHEDULED", "CONFIRMED"] },
        },
        take: 10,
        orderBy: { dateTime: "asc" },
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      }),
    ])

    const stats = {
      patients: {
        total: totalPatients,
        newThisMonth: newPatientsThisMonth,
      },
      appointments: {
        thisWeek: appointmentsThisWeek,
        today: todayAppointments.length,
        todayList: todayAppointments,
      },
      consultations: {
        thisMonth: consultationsThisMonth,
      },
      revenue: {
        thisMonth: monthlyRevenue._sum.total || 0,
        expenses: monthlyExpenses._sum.amount || 0,
        profit: (monthlyRevenue._sum.total || 0) - (monthlyExpenses._sum.amount || 0),
      },
      pending: {
        invoicesCount: pendingInvoices._count,
        invoicesAmount: pendingInvoices._sum.total || 0,
      },
      recentPatients,
      upcomingAppointments,
    }

    return successResponse(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return errorResponse("Erreur lors de la récupération des statistiques", 500)
  }
}

