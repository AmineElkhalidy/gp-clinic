import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { errorResponse, notFoundResponse } from "@/lib/api-response"

// GET /api/prescriptions/[id]/pdf - Get prescription data for PDF generation
// Note: Actual PDF generation happens client-side with jsPDF
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        medications: true,
        consultation: {
          include: {
            patient: true,
            doctor: true,
          },
        },
      },
    })

    if (!prescription) {
      return notFoundResponse("Ordonnance")
    }

    // Get clinic settings
    const clinicSettings = await prisma.clinicSettings.findFirst()

    // Calculate patient age
    let patientAge: number | undefined
    if (prescription.consultation.patient.dateOfBirth) {
      const dob = new Date(prescription.consultation.patient.dateOfBirth)
      const today = new Date()
      patientAge = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        patientAge--
      }
    }

    // Format data for PDF
    const pdfData = {
      clinicName: clinicSettings?.name || "Cabinet Médical",
      clinicAddress: clinicSettings?.address || "El Attaouia, Maroc",
      clinicPhone: clinicSettings?.phone || "",
      doctorName: prescription.consultation.doctor.name,
      doctorSpecialty:
        prescription.consultation.doctor.specialty || "Médecine Générale",

      patientName: `${prescription.consultation.patient.firstName} ${prescription.consultation.patient.lastName}`,
      patientAge,
      patientGender: prescription.consultation.patient.gender,

      date: prescription.date,
      prescriptionId: prescription.id.slice(0, 8).toUpperCase(),
      diagnosis: prescription.consultation.diagnosis,
      medications: prescription.medications.map((med) => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions,
        quantity: med.quantity,
      })),
      notes: prescription.notes,
    }

    return Response.json({ success: true, data: pdfData })
  } catch (error) {
    console.error("Error fetching prescription for PDF:", error)
    return errorResponse("Erreur lors de la récupération de l'ordonnance", 500)
  }
}

