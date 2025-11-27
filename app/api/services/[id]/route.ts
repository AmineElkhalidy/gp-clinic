import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response"

// GET /api/services/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const service = await prisma.service.findUnique({
      where: { id },
    })

    if (!service) {
      return notFoundResponse("Service")
    }

    return successResponse(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    return errorResponse("Erreur lors de la récupération du service", 500)
  }
}

// PUT /api/services/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingService = await prisma.service.findUnique({
      where: { id },
    })

    if (!existingService) {
      return notFoundResponse("Service")
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price ? parseFloat(body.price) : undefined,
        duration: body.duration,
        isActive: body.isActive,
      },
    })

    return successResponse(service)
  } catch (error) {
    console.error("Error updating service:", error)
    return errorResponse("Erreur lors de la mise à jour du service", 500)
  }
}

// DELETE /api/services/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingService = await prisma.service.findUnique({
      where: { id },
    })

    if (!existingService) {
      return notFoundResponse("Service")
    }

    // Soft delete - just deactivate
    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    })

    return successResponse({ message: "Service désactivé avec succès" })
  } catch (error) {
    console.error("Error deleting service:", error)
    return errorResponse("Erreur lors de la suppression du service", 500)
  }
}

