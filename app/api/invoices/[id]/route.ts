import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response"

// GET /api/invoices/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        patient: true,
        consultation: true,
        createdBy: {
          select: { id: true, name: true },
        },
        items: {
          include: { service: true },
        },
      },
    })

    if (!invoice) {
      return notFoundResponse("Facture")
    }

    return successResponse(invoice)
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return errorResponse("Erreur lors de la récupération de la facture", 500)
  }
}

// PUT /api/invoices/[id] - Update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
    })

    if (!existingInvoice) {
      return notFoundResponse("Facture")
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        discount: body.discount,
        tax: body.tax,
        total: body.total,
        notes: body.notes,
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        items: true,
      },
    })

    return successResponse(invoice)
  } catch (error) {
    console.error("Error updating invoice:", error)
    return errorResponse("Erreur lors de la mise à jour de la facture", 500)
  }
}

// PATCH /api/invoices/[id] - Mark as paid
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
    })

    if (!existingInvoice) {
      return notFoundResponse("Facture")
    }

    const amountPaid = body.amountPaid || existingInvoice.total
    let paymentStatus = existingInvoice.paymentStatus

    if (amountPaid >= existingInvoice.total) {
      paymentStatus = "PAID"
    } else if (amountPaid > 0) {
      paymentStatus = "PARTIAL"
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        amountPaid,
        paymentStatus,
        paymentMethod: body.paymentMethod || existingInvoice.paymentMethod,
        paymentDate: new Date(),
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    })

    return successResponse(invoice)
  } catch (error) {
    console.error("Error updating invoice payment:", error)
    return errorResponse("Erreur lors de la mise à jour du paiement", 500)
  }
}

// DELETE /api/invoices/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
    })

    if (!existingInvoice) {
      return notFoundResponse("Facture")
    }

    await prisma.invoice.delete({
      where: { id },
    })

    return successResponse({ message: "Facture supprimée avec succès" })
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return errorResponse("Erreur lors de la suppression de la facture", 500)
  }
}

