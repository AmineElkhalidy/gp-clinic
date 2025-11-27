import jsPDF from "jspdf"

interface Medication {
  name: string
  dosage?: string | null
  frequency?: string | null
  duration?: string | null
  instructions?: string | null
  quantity?: number | null
}

interface PrescriptionData {
  // Clinic info
  clinicName: string
  clinicAddress: string
  clinicPhone: string
  doctorName: string
  doctorSpecialty: string

  // Patient info
  patientName: string
  patientAge?: number
  patientGender?: string

  // Prescription info
  date: Date
  prescriptionId: string
  diagnosis?: string
  medications: Medication[]
  notes?: string
}

export function generatePrescriptionPDF(data: PrescriptionData): jsPDF {
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
  const tealColor: [number, number, number] = [13, 148, 136] // teal-600
  const darkGray: [number, number, number] = [51, 65, 85] // slate-700
  const lightGray: [number, number, number] = [148, 163, 184] // slate-400

  // === HEADER ===
  // Doctor/Clinic Info (Left side)
  doc.setFontSize(16)
  doc.setTextColor(...tealColor)
  doc.setFont("helvetica", "bold")
  doc.text(data.clinicName, margin, yPos)
  yPos += 6

  doc.setFontSize(10)
  doc.setTextColor(...darkGray)
  doc.setFont("helvetica", "normal")
  doc.text(data.doctorName, margin, yPos)
  yPos += 5
  doc.text(data.doctorSpecialty, margin, yPos)
  yPos += 5

  doc.setFontSize(9)
  doc.setTextColor(...lightGray)
  doc.text(data.clinicAddress, margin, yPos)
  yPos += 4
  doc.text(`Tél: ${data.clinicPhone}`, margin, yPos)

  // Date (Right side)
  doc.setFontSize(10)
  doc.setTextColor(...darkGray)
  const dateStr = new Date(data.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  doc.text(dateStr, pageWidth - margin, margin, { align: "right" })

  // Prescription number
  doc.setFontSize(8)
  doc.setTextColor(...lightGray)
  doc.text(`N°: ${data.prescriptionId}`, pageWidth - margin, margin + 5, {
    align: "right",
  })

  // Horizontal line
  yPos += 10
  doc.setDrawColor(...tealColor)
  doc.setLineWidth(0.5)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 10

  // === TITLE ===
  doc.setFontSize(18)
  doc.setTextColor(...tealColor)
  doc.setFont("helvetica", "bold")
  doc.text("ORDONNANCE MÉDICALE", pageWidth / 2, yPos, { align: "center" })
  yPos += 15

  // === PATIENT INFO ===
  doc.setFontSize(11)
  doc.setTextColor(...darkGray)
  doc.setFont("helvetica", "bold")
  doc.text("Patient(e):", margin, yPos)
  doc.setFont("helvetica", "normal")
  let patientInfo = data.patientName
  if (data.patientAge) patientInfo += ` - ${data.patientAge} ans`
  if (data.patientGender)
    patientInfo += ` (${data.patientGender === "MALE" ? "M" : "F"})`
  doc.text(patientInfo, margin + 25, yPos)
  yPos += 10

  // Diagnosis if provided
  if (data.diagnosis) {
    doc.setFont("helvetica", "bold")
    doc.text("Diagnostic:", margin, yPos)
    doc.setFont("helvetica", "normal")
    const diagnosisLines = doc.splitTextToSize(
      data.diagnosis,
      pageWidth - margin * 2 - 30
    )
    doc.text(diagnosisLines, margin + 30, yPos)
    yPos += diagnosisLines.length * 5 + 5
  }

  yPos += 5

  // === MEDICATIONS ===
  doc.setDrawColor(...lightGray)
  doc.setLineWidth(0.1)

  data.medications.forEach((med, index) => {
    // Check if we need a new page
    if (yPos > pageHeight - 50) {
      doc.addPage()
      yPos = margin
    }

    // Medication number circle
    doc.setFillColor(...tealColor)
    doc.circle(margin + 3, yPos - 2, 4, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    doc.text(String(index + 1), margin + 3, yPos - 1, { align: "center" })

    // Medication name
    doc.setTextColor(...darkGray)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(med.name, margin + 12, yPos)
    yPos += 6

    // Medication details
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...darkGray)

    const details: string[] = []
    if (med.dosage) details.push(`Posologie: ${med.dosage}`)
    if (med.frequency) details.push(`Fréquence: ${med.frequency}`)
    if (med.duration) details.push(`Durée: ${med.duration}`)
    if (med.quantity) details.push(`Quantité: ${med.quantity}`)

    details.forEach((detail) => {
      doc.text(`• ${detail}`, margin + 12, yPos)
      yPos += 5
    })

    // Instructions in italics
    if (med.instructions) {
      doc.setFont("helvetica", "italic")
      doc.setTextColor(...lightGray)
      const instructionLines = doc.splitTextToSize(
        med.instructions,
        pageWidth - margin * 2 - 15
      )
      doc.text(instructionLines, margin + 12, yPos)
      yPos += instructionLines.length * 4 + 3
    }

    yPos += 8

    // Separator line (except for last item)
    if (index < data.medications.length - 1) {
      doc.setDrawColor(230, 230, 230)
      doc.line(margin + 12, yPos - 4, pageWidth - margin, yPos - 4)
    }
  })

  // === NOTES ===
  if (data.notes) {
    yPos += 5
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(...darkGray)
    doc.text("Remarques:", margin, yPos)
    yPos += 5
    doc.setFont("helvetica", "normal")
    const notesLines = doc.splitTextToSize(
      data.notes,
      pageWidth - margin * 2
    )
    doc.text(notesLines, margin, yPos)
    yPos += notesLines.length * 4 + 10
  }

  // === SIGNATURE AREA ===
  // Make sure we have space for signature
  if (yPos > pageHeight - 60) {
    doc.addPage()
    yPos = margin
  }

  yPos = pageHeight - 50

  // Signature line
  doc.setDrawColor(...darkGray)
  doc.setLineWidth(0.3)
  doc.line(pageWidth - margin - 60, yPos, pageWidth - margin, yPos)

  doc.setFontSize(9)
  doc.setTextColor(...darkGray)
  doc.text("Signature et cachet", pageWidth - margin - 30, yPos + 5, {
    align: "center",
  })

  // === FOOTER ===
  doc.setFontSize(8)
  doc.setTextColor(...lightGray)
  doc.text(
    "Document généré électroniquement - Cabinet Médical",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  )

  return doc
}

