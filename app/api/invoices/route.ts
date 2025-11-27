import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

// GET /api/invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const patientId = searchParams.get("patientId")

    const skip = (page - 1) * limit
    const where: any = {}

    if (status && status !== "all") {
      where.paymentStatus = status
    }

    if (patientId) {
      where.patientId = patientId
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          patient: {
            select: { id: true, firstName: true, lastName: true },
          },
          items: {
            include: { service: true },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ])

    return paginatedResponse(invoices, { page, limit, total })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return errorResponse("Erreur lors de la récupération des factures", 500)
  }
}

// POST /api/invoices - Create invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.patientId || !body.items || body.items.length === 0) {
      return errorResponse("Patient et articles sont requis")
    }

    // Generate invoice number
    const year = new Date().getFullYear()
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: { startsWith: `FAC-${year}` },
      },
      orderBy: { invoiceNumber: "desc" },
    })

    let nextNumber = 1
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split("-").pop() || "0")
      nextNumber = lastNumber + 1
    }

    const invoiceNumber = `FAC-${year}-${String(nextNumber).padStart(5, "0")}`

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0
    )
    const discount = body.discount || 0
    const tax = body.tax || 0
    const total = subtotal - discount + tax

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        patientId: body.patientId,
        consultationId: body.consultationId || null,
        createdById: body.createdById,
        date: body.date ? new Date(body.date) : new Date(),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        subtotal,
        discount,
        tax,
        total,
        amountPaid: body.amountPaid || 0,
        paymentStatus: body.amountPaid >= total ? "PAID" : body.amountPaid > 0 ? "PARTIAL" : "PENDING",
        paymentMethod: body.paymentMethod || null,
        paymentDate: body.amountPaid > 0 ? new Date() : null,
        notes: body.notes || null,
        items: {
          create: body.items.map((item: any) => ({
            serviceId: item.serviceId || null,
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice,
            total: (item.quantity || 1) * item.unitPrice,
          })),
        },
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        items: {
          include: { service: true },
        },
      },
    })

    return successResponse(invoice, 201)
  } catch (error) {
    console.error("Error creating invoice:", error)
    return errorResponse("Erreur lors de la création de la facture", 500)
  }
}

