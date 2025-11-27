import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response"

// GET /api/users/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        specialty: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return notFoundResponse("Utilisateur")
    }

    return successResponse(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return errorResponse("Erreur lors de la récupération de l'utilisateur", 500)
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return notFoundResponse("Utilisateur")
    }

    // Check if email is being changed and already exists
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: { email: body.email, NOT: { id } },
      })
      if (emailExists) {
        return errorResponse("Un utilisateur avec cet email existe déjà")
      }
    }

    // Prepare update data
    const updateData: any = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      specialty: body.specialty,
    }

    // If password is being changed
    if (body.password && body.password.length > 0) {
      if (body.password.length < 8) {
        return errorResponse("Le mot de passe doit contenir au moins 8 caractères")
      }
      updateData.password = await hashPassword(body.password)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        specialty: true,
        updatedAt: true,
      },
    })

    return successResponse(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return errorResponse("Erreur lors de la mise à jour de l'utilisateur", 500)
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return notFoundResponse("Utilisateur")
    }

    // Prevent deleting the last doctor
    if (existingUser.role === "DOCTOR") {
      const doctorCount = await prisma.user.count({
        where: { role: "DOCTOR" },
      })
      if (doctorCount <= 1) {
        return errorResponse("Impossible de supprimer le dernier médecin du système")
      }
    }

    await prisma.user.delete({
      where: { id },
    })

    return successResponse({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return errorResponse("Erreur lors de la suppression de l'utilisateur", 500)
  }
}

