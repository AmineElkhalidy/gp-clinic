import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

// GET /api/users - Get all users (for admin/doctor)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
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
      orderBy: { createdAt: "desc" },
    })

    return successResponse(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return errorResponse("Erreur lors de la récupération des utilisateurs", 500)
  }
}

// POST /api/users - Create a new user (Assistant)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.password) {
      return errorResponse("Nom, email et mot de passe sont requis")
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return errorResponse("Un utilisateur avec cet email existe déjà")
    }

    if (body.password.length < 8) {
      return errorResponse("Le mot de passe doit contenir au moins 8 caractères")
    }

    const hashedPassword = await hashPassword(body.password)

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || "ASSISTANT",
        phone: body.phone || null,
        specialty: body.specialty || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        specialty: true,
        createdAt: true,
      },
    })

    return successResponse(user, 201)
  } catch (error) {
    console.error("Error creating user:", error)
    return errorResponse("Erreur lors de la création de l'utilisateur", 500)
  }
}

