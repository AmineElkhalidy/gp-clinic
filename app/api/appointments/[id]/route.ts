import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response"

// GET /api/appointments/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        consultation: {
          include: {
            prescriptions: {
              include: { medications: true },
            },
          },
        },
      },
    })

    if (!appointment) {
      return notFoundResponse("Rendez-vous")
    }

    return successResponse(appointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return errorResponse("Erreur lors de la récupération du rendez-vous", 500)
  }
}

// PUT /api/appointments/[id] - Update appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!existingAppointment) {
      return notFoundResponse("Rendez-vous")
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        dateTime: body.dateTime ? new Date(body.dateTime) : undefined,
        duration: body.duration,
        type: body.type,
        reason: body.reason,
        notes: body.notes,
        status: body.status,
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

    return successResponse(appointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return errorResponse("Erreur lors de la mise à jour du rendez-vous", 500)
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    })

    if (!existingAppointment) {
      return notFoundResponse("Rendez-vous")
    }

    await prisma.appointment.delete({
      where: { id },
    })

    return successResponse({ message: "Rendez-vous supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return errorResponse("Erreur lors de la suppression du rendez-vous", 500)
  }
}

// PATCH /api/appointments/[id] - Update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.status) {
      return errorResponse("Statut requis")
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: body.status },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return successResponse(appointment)
  } catch (error) {
    console.error("Error updating appointment status:", error)
    return errorResponse("Erreur lors de la mise à jour du statut", 500)
  }
}

