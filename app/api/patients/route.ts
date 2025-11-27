import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

// GET /api/patients - Get all patients with search and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const gender = searchParams.get("gender")

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ]
    }

    if (gender && gender !== "all") {
      where.gender = gender
    }

    // Get patients and total count
    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              appointments: true,
              consultations: true,
            },
          },
        },
      }),
      prisma.patient.count({ where }),
    ])

    return paginatedResponse(patients, { page, limit, total })
  } catch (error) {
    console.error("Error fetching patients:", error)
    return errorResponse("Erreur lors de la récupération des patients", 500)
  }
}

// POST /api/patients - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.phone) {
      return errorResponse("Prénom, nom et téléphone sont requis")
    }

    // Check if phone already exists
    const existingPatient = await prisma.patient.findFirst({
      where: { phone: body.phone },
    })

    if (existingPatient) {
      return errorResponse("Un patient avec ce numéro de téléphone existe déjà")
    }

    const patient = await prisma.patient.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender || null,
        phone: body.phone,
        phoneSecondary: body.phoneSecondary || null,
        email: body.email || null,
        address: body.address || null,
        city: body.city || "El Attaouia",
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

    return successResponse(patient, 201)
  } catch (error) {
    console.error("Error creating patient:", error)
    return errorResponse("Erreur lors de la création du patient", 500)
  }
}

