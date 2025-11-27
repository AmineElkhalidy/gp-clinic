import jsPDF from "jspdf"

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface InvoiceData {
  // Clinic info
  clinicName: string
  clinicAddress: string
  clinicPhone: string
  clinicEmail?: string

  // Patient info
  patientName: string
  patientPhone?: string
  patientAddress?: string

  // Invoice info
  invoiceNumber: string
  date: Date
  dueDate?: Date
  items: InvoiceItem[]
  subtotal: number
  discount?: number
  tax?: number
  total: number
  amountPaid: number
  paymentStatus: string
  paymentMethod?: string
  notes?: string
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPos = margin

  // Colors
  const tealColor: [number, number, number] = [13, 148, 136]
  const darkGray: [number, number, number] = [51, 65, 85]
  const lightGray: [number, number, number] = [148, 163, 184]
  const greenColor: [number, number, number] = [34, 197, 94]
  const orangeColor: [number, number, number] = [249, 115, 22]

  // === HEADER ===
  // Clinic Name
  doc.setFontSize(20)
  doc.setTextColor(...tealColor)
  doc.setFont("helvetica", "bold")
  doc.text(data.clinicName, margin, yPos)
  yPos += 7

  // Clinic details
  doc.setFontSize(9)
  doc.setTextColor(...darkGray)
  doc.setFont("helvetica", "normal")
  doc.text(data.clinicAddress, margin, yPos)
  yPos += 4
  doc.text(`Tél: ${data.clinicPhone}`, margin, yPos)
  if (data.clinicEmail) {
    yPos += 4
    doc.text(`Email: ${data.clinicEmail}`, margin, yPos)
  }

  // FACTURE title (right side)
  doc.setFontSize(28)
  doc.setTextColor(...tealColor)
  doc.setFont("helvetica", "bold")
  doc.text("FACTURE", pageWidth - margin, margin + 5, { align: "right" })

  doc.setFontSize(10)
  doc.setTextColor(...darkGray)
  doc.setFont("helvetica", "normal")
  doc.text(`N° ${data.invoiceNumber}`, pageWidth - margin, margin + 12, {
    align: "right",
  })

  // Date
  const dateStr = new Date(data.date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  doc.text(`Date: ${dateStr}`, pageWidth - margin, margin + 18, {
    align: "right",
  })

  yPos += 20

  // Horizontal line
  doc.setDrawColor(...tealColor)
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 15

  // === PATIENT INFO BOX ===
  doc.setFillColor(248, 250, 252) // slate-50
  doc.roundedRect(margin, yPos - 5, 80, 35, 3, 3, "F")

  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...tealColor)
  doc.text("Facturé à:", margin + 5, yPos + 2)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(...darkGray)
  doc.setFontSize(11)
  doc.text(data.patientName, margin + 5, yPos + 10)

  doc.setFontSize(9)
  if (data.patientPhone) {
    doc.text(`Tél: ${data.patientPhone}`, margin + 5, yPos + 16)
  }
  if (data.patientAddress) {
    const addressLines = doc.splitTextToSize(data.patientAddress, 70)
    doc.text(addressLines, margin + 5, yPos + 22)
  }

  // Payment status badge (right side)
  let statusColor: [number, number, number] = lightGray
  let statusText = "En attente"

  if (data.paymentStatus === "PAID") {
    statusColor = greenColor
    statusText = "PAYÉE"
  } else if (data.paymentStatus === "PARTIAL") {
    statusColor = orangeColor
    statusText = "PARTIEL"
  } else if (data.paymentStatus === "CANCELLED") {
    statusColor = [239, 68, 68] // red
    statusText = "ANNULÉE"
  }

  doc.setFillColor(...statusColor)
  doc.roundedRect(pageWidth - margin - 35, yPos - 5, 35, 12, 2, 2, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text(statusText, pageWidth - margin - 17.5, yPos + 2, { align: "center" })

  yPos += 40

  // === ITEMS TABLE ===
  const tableStartY = yPos

  // Table header
  doc.setFillColor(...tealColor)
  doc.rect(margin, yPos, pageWidth - margin * 2, 10, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")

  const col1 = margin + 3
  const col2 = margin + 90
  const col3 = margin + 110
  const col4 = margin + 140

  doc.text("Description", col1, yPos + 7)
  doc.text("Qté", col2, yPos + 7)
  doc.text("Prix unit.", col3, yPos + 7)
  doc.text("Total", col4, yPos + 7)

  yPos += 12

  // Table rows
  doc.setTextColor(...darkGray)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)

  data.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252)
      doc.rect(margin, yPos - 2, pageWidth - margin * 2, 10, "F")
    }

    doc.setTextColor(...darkGray)
    doc.text(item.description, col1, yPos + 5)
    doc.text(String(item.quantity), col2, yPos + 5)
    doc.text(`${item.unitPrice.toFixed(2)} DH`, col3, yPos + 5)
    doc.text(`${item.total.toFixed(2)} DH`, col4, yPos + 5)

    yPos += 10
  })

  // Table bottom line
  doc.setDrawColor(...lightGray)
  doc.setLineWidth(0.3)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // === TOTALS ===
  const totalsX = pageWidth - margin - 60

  // Subtotal
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("Sous-total:", totalsX, yPos)
  doc.text(`${data.subtotal.toFixed(2)} DH`, pageWidth - margin, yPos, {
    align: "right",
  })
  yPos += 6

  // Discount
  if (data.discount && data.discount > 0) {
    doc.text("Remise:", totalsX, yPos)
    doc.text(`-${data.discount.toFixed(2)} DH`, pageWidth - margin, yPos, {
      align: "right",
    })
    yPos += 6
  }

  // Tax
  if (data.tax && data.tax > 0) {
    doc.text("TVA:", totalsX, yPos)
    doc.text(`${data.tax.toFixed(2)} DH`, pageWidth - margin, yPos, {
      align: "right",
    })
    yPos += 6
  }

  // Total
  yPos += 2
  doc.setDrawColor(...tealColor)
  doc.setLineWidth(0.5)
  doc.line(totalsX - 10, yPos, pageWidth - margin, yPos)
  yPos += 6

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...tealColor)
  doc.text("TOTAL:", totalsX, yPos)
  doc.text(`${data.total.toFixed(2)} DH`, pageWidth - margin, yPos, {
    align: "right",
  })

  // Amount paid
  if (data.amountPaid > 0) {
    yPos += 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...darkGray)
    doc.text("Montant payé:", totalsX, yPos)
    doc.text(`${data.amountPaid.toFixed(2)} DH`, pageWidth - margin, yPos, {
      align: "right",
    })

    // Remaining
    const remaining = data.total - data.amountPaid
    if (remaining > 0) {
      yPos += 6
      doc.setTextColor(...orangeColor)
      doc.text("Reste à payer:", totalsX, yPos)
      doc.text(`${remaining.toFixed(2)} DH`, pageWidth - margin, yPos, {
        align: "right",
      })
    }
  }

  // Payment method
  if (data.paymentMethod) {
    yPos += 8
    doc.setFontSize(9)
    doc.setTextColor(...lightGray)
    doc.text(`Mode de paiement: ${data.paymentMethod}`, totalsX - 10, yPos)
  }

  // === NOTES ===
  if (data.notes) {
    yPos += 20
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.text("Remarques:", margin, yPos)
    yPos += 5
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    const notesLines = doc.splitTextToSize(data.notes, pageWidth - margin * 2)
    doc.text(notesLines, margin, yPos)
  }

  // === FOOTER ===
  doc.setFontSize(8)
  doc.setTextColor(...lightGray)
  doc.text(
    "Merci pour votre confiance - Ce document est une facture officielle",
    pageWidth / 2,
    pageHeight - 15,
    { align: "center" }
  )
  doc.text(
    data.clinicName + " - " + data.clinicAddress,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  )

  return doc
}

