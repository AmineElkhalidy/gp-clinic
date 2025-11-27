import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-response"

// POST /api/auth/setup - Create initial admin/doctor user
// This should only work if no users exist yet
export async function POST(request: NextRequest) {
  try {
    // Check if any users already exist
    const existingUsers = await prisma.user.count()

    if (existingUsers > 0) {
      return errorResponse(
        "Le système est déjà configuré. Veuillez contacter l'administrateur pour créer un compte.",
        403
      )
    }

    const body = await request.json()

    if (!body.name || !body.email || !body.password) {
      return errorResponse("Nom, email et mot de passe sont requis")
    }

    if (body.password.length < 8) {
      return errorResponse("Le mot de passe doit contenir au moins 8 caractères")
    }

    const hashedPassword = await hashPassword(body.password)

    // Create the doctor user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: "DOCTOR",
        phone: body.phone || null,
        specialty: body.specialty || "Médecine Générale",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        specialty: true,
        createdAt: true,
      },
    })

    // Also create default clinic settings
    await prisma.clinicSettings.create({
      data: {
        name: "Cabinet Médical",
        address: "El Attaouia, Maroc",
        phone: body.phone || "",
        email: body.email,
        consultationFee: 100,
      },
    })

    // Create default services
    await prisma.service.createMany({
      data: [
        { name: "Consultation générale", price: 100, duration: 30 },
        { name: "Certificat médical", price: 50, duration: 15 },
        { name: "Bilan de santé", price: 200, duration: 45 },
        { name: "Suivi grossesse", price: 150, duration: 30 },
        { name: "Vaccination", price: 80, duration: 15 },
        { name: "ECG", price: 100, duration: 20 },
        { name: "Petite chirurgie", price: 150, duration: 30 },
      ],
    })

    return successResponse({
      message: "Configuration initiale réussie",
      user,
    }, 201)
  } catch (error) {
    console.error("Error in setup:", error)
    return errorResponse("Erreur lors de la configuration initiale", 500)
  }
}

// GET /api/auth/setup - Check if setup is needed
export async function GET() {
  try {
    const existingUsers = await prisma.user.count()

    return successResponse({
      setupRequired: existingUsers === 0,
    })
  } catch (error) {
    console.error("Error checking setup:", error)
    return errorResponse("Erreur lors de la vérification", 500)
  }
}

