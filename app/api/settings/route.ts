import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"

// GET /api/settings - Get clinic settings
export async function GET() {
  try {
    let settings = await prisma.clinicSettings.findFirst()

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.clinicSettings.create({
        data: {
          name: "Cabinet Médical",
          address: "El Attaouia, Maroc",
          phone: "",
          email: "",
          consultationFee: 100,
        },
      })
    }

    return successResponse(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return errorResponse("Erreur lors de la récupération des paramètres", 500)
  }
}

// PUT /api/settings - Update clinic settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    let settings = await prisma.clinicSettings.findFirst()

    if (settings) {
      settings = await prisma.clinicSettings.update({
        where: { id: settings.id },
        data: {
          name: body.name,
          address: body.address,
          phone: body.phone,
          email: body.email,
          website: body.website,
          logo: body.logo,
          consultationFee: body.consultationFee,
          openingHours: body.openingHours,
        },
      })
    } else {
      settings = await prisma.clinicSettings.create({
        data: {
          name: body.name || "Cabinet Médical",
          address: body.address || "",
          phone: body.phone || "",
          email: body.email || "",
          website: body.website,
          logo: body.logo,
          consultationFee: body.consultationFee || 100,
          openingHours: body.openingHours,
        },
      })
    }

    return successResponse(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return errorResponse("Erreur lors de la mise à jour des paramètres", 500)
  }
}

