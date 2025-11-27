import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

// GET /api/appointments - Get appointments with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const date = searchParams.get("date") // YYYY-MM-DD
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const status = searchParams.get("status")
    const patientId = searchParams.get("patientId")

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (date) {
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)
      where.dateTime = { gte: dayStart, lte: dayEnd }
    } else if (startDate && endDate) {
      where.dateTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    if (status && status !== "all") {
      where.status = status
    }

    if (patientId) {
      where.patientId = patientId
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateTime: "asc" },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      }),
      prisma.appointment.count({ where }),
    ])

    return paginatedResponse(appointments, { page, limit, total })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return errorResponse("Erreur lors de la récupération des rendez-vous", 500)
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.patientId || !body.dateTime) {
      return errorResponse("Patient et date/heure sont requis")
    }

    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: body.patientId },
    })

    if (!patient) {
      return errorResponse("Patient non trouvé")
    }

    // Check for conflicts (overlapping appointments)
    const appointmentDateTime = new Date(body.dateTime)
    const duration = body.duration || 30
    const endTime = new Date(appointmentDateTime.getTime() + duration * 60000)

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
        OR: [
          {
            dateTime: {
              gte: appointmentDateTime,
              lt: endTime,
            },
          },
          {
            AND: [
              { dateTime: { lte: appointmentDateTime } },
              {
                dateTime: {
                  gt: new Date(appointmentDateTime.getTime() - 60 * 60000), // Check 1 hour before
                },
              },
            ],
          },
        ],
      },
    })

    if (conflictingAppointment) {
      return errorResponse("Un autre rendez-vous est déjà programmé à cette heure")
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: body.patientId,
        dateTime: appointmentDateTime,
        duration: duration,
        type: body.type || "consultation",
        reason: body.reason || null,
        notes: body.notes || null,
        status: "SCHEDULED",
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    })

    return successResponse(appointment, 201)
  } catch (error) {
    console.error("Error creating appointment:", error)
    return errorResponse("Erreur lors de la création du rendez-vous", 500)
  }
}

