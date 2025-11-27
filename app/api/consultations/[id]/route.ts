import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response"

// GET /api/consultations/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          select: { id: true, name: true, email: true },
        },
        appointment: true,
        prescriptions: {
          include: { medications: true },
        },
        invoice: true,
      },
    })

    if (!consultation) {
      return notFoundResponse("Consultation")
    }

    return successResponse(consultation)
  } catch (error) {
    console.error("Error fetching consultation:", error)
    return errorResponse("Erreur lors de la récupération de la consultation", 500)
  }
}

// PUT /api/consultations/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingConsultation = await prisma.consultation.findUnique({
      where: { id },
    })

    if (!existingConsultation) {
      return notFoundResponse("Consultation")
    }

    const consultation = await prisma.consultation.update({
      where: { id },
      data: {
        weight: body.weight,
        height: body.height,
        bloodPressure: body.bloodPressure,
        heartRate: body.heartRate,
        temperature: body.temperature,
        chiefComplaint: body.chiefComplaint,
        symptoms: body.symptoms,
        physicalExam: body.physicalExam,
        diagnosis: body.diagnosis,
        differentialDiagnosis: body.differentialDiagnosis,
        treatmentPlan: body.treatmentPlan,
        recommendations: body.recommendations,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        notes: body.notes,
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        prescriptions: {
          include: { medications: true },
        },
      },
    })

    return successResponse(consultation)
  } catch (error) {
    console.error("Error updating consultation:", error)
    return errorResponse("Erreur lors de la mise à jour de la consultation", 500)
  }
}

// DELETE /api/consultations/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingConsultation = await prisma.consultation.findUnique({
      where: { id },
    })

    if (!existingConsultation) {
      return notFoundResponse("Consultation")
    }

    await prisma.consultation.delete({
      where: { id },
    })

    return successResponse({ message: "Consultation supprimée avec succès" })
  } catch (error) {
    console.error("Error deleting consultation:", error)
    return errorResponse("Erreur lors de la suppression de la consultation", 500)
  }
}

