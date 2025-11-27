import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, notFoundResponse } from "@/lib/api-response"

// GET /api/invoices/[id]/pdf - Get invoice data for PDF generation
// Note: Actual PDF generation happens client-side with jsPDF
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
        items: {
          include: { service: true },
        },
      },
    })

    if (!invoice) {
      return notFoundResponse("Facture")
    }

    // Get clinic settings
    const clinicSettings = await prisma.clinicSettings.findFirst()

    // Format data for PDF
    const pdfData = {
      clinicName: clinicSettings?.name || "Cabinet Médical",
      clinicAddress: clinicSettings?.address || "El Attaouia, Maroc",
      clinicPhone: clinicSettings?.phone || "",
      clinicEmail: clinicSettings?.email,

      patientName: `${invoice.patient.firstName} ${invoice.patient.lastName}`,
      patientPhone: invoice.patient.phone,
      patientAddress: invoice.patient.address,

      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      dueDate: invoice.dueDate,
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      subtotal: invoice.subtotal,
      discount: invoice.discount,
      tax: invoice.tax,
      total: invoice.total,
      amountPaid: invoice.amountPaid,
      paymentStatus: invoice.paymentStatus,
      paymentMethod: invoice.paymentMethod,
      notes: invoice.notes,
    }

    return Response.json({ success: true, data: pdfData })
  } catch (error) {
    console.error("Error fetching invoice for PDF:", error)
    return errorResponse("Erreur lors de la récupération de la facture", 500)
  }
}

