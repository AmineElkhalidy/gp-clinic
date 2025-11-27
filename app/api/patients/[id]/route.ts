import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response"

// GET /api/patients/[id] - Get a single patient with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { dateTime: "desc" },
          take: 10,
        },
        consultations: {
          orderBy: { date: "desc" },
          take: 10,
          include: {
            doctor: {
              select: { name: true },
            },
            prescriptions: {
              include: {
                medications: true,
              },
            },
          },
        },
        invoices: {
          orderBy: { date: "desc" },
          take: 10,
        },
        attachments: {
          orderBy: { uploadedAt: "desc" },
        },
        _count: {
          select: {
            appointments: true,
            consultations: true,
            invoices: true,
          },
        },
      },
    })

    if (!patient) {
      return notFoundResponse("Patient")
    }

    return successResponse(patient)
  } catch (error) {
    console.error("Error fetching patient:", error)
    return errorResponse("Erreur lors de la récupération du patient", 500)
  }
}

// PUT /api/patients/[id] - Update a patient
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    })

    if (!existingPatient) {
      return notFoundResponse("Patient")
    }

    // Check if phone is being changed and already exists
    if (body.phone && body.phone !== existingPatient.phone) {
      const phoneExists = await prisma.patient.findFirst({
        where: { phone: body.phone, NOT: { id } },
      })
      if (phoneExists) {
        return errorResponse("Un patient avec ce numéro de téléphone existe déjà")
      }
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender || null,
        phone: body.phone,
        phoneSecondary: body.phoneSecondary || null,
        email: body.email || null,
        address: body.address || null,
        city: body.city,
        maritalStatus: body.maritalStatus || null,
        occupation: body.occupation || null,
        bloodType: body.bloodType || null,
        allergies: body.allergies || null,
        chronicDiseases: body.chronicDiseases || null,
        currentMedications: body.currentMedications || null,
        familyHistory: body.familyHistory || null,
        notes: body.notes || null,
      },
    })

    return successResponse(patient)
  } catch (error) {
    console.error("Error updating patient:", error)
    return errorResponse("Erreur lors de la mise à jour du patient", 500)
  }
}

// DELETE /api/patients/[id] - Delete a patient
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    })

    if (!existingPatient) {
      return notFoundResponse("Patient")
    }

    await prisma.patient.delete({
      where: { id },
    })

    return successResponse({ message: "Patient supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting patient:", error)
    return errorResponse("Erreur lors de la suppression du patient", 500)
  }
}

