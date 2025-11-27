import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"

// GET /api/services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const where: any = {}
    if (activeOnly) {
      where.isActive = true
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { name: "asc" },
    })

    return successResponse(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return errorResponse("Erreur lors de la récupération des services", 500)
  }
}

// POST /api/services
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || body.price === undefined) {
      return errorResponse("Nom et prix sont requis")
    }

    const service = await prisma.service.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: parseFloat(body.price),
        duration: body.duration || null,
        isActive: body.isActive !== false,
      },
    })

    return successResponse(service, 201)
  } catch (error) {
    console.error("Error creating service:", error)
    return errorResponse("Erreur lors de la création du service", 500)
  }
}

