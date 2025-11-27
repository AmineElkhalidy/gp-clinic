import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

// GET /api/consultations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const patientId = searchParams.get("patientId")
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    const where: any = {}

    if (patientId) {
      where.patientId = patientId
    }

    if (search) {
      where.OR = [
        { diagnosis: { contains: search, mode: "insensitive" } },
        { patient: { firstName: { contains: search, mode: "insensitive" } } },
        { patient: { lastName: { contains: search, mode: "insensitive" } } },
      ]
    }

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
            },
          },
          prescriptions: {
            include: { medications: true },
          },
        },
      }),
      prisma.consultation.count({ where }),
    ])

    return paginatedResponse(consultations, { page, limit, total })
  } catch (error) {
    console.error("Error fetching consultations:", error)
    return errorResponse("Erreur lors de la récupération des consultations", 500)
  }
}

// POST /api/consultations - Create consultation with prescription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.patientId || !body.doctorId) {
      return errorResponse("Patient et médecin sont requis")
    }

    // Create consultation with nested prescription
    const consultation = await prisma.consultation.create({
      data: {
        patientId: body.patientId,
        doctorId: body.doctorId,
        appointmentId: body.appointmentId || null,
        date: body.date ? new Date(body.date) : new Date(),
        // Vital signs
        weight: body.weight || null,
        height: body.height || null,
        bloodPressure: body.bloodPressure || null,
        heartRate: body.heartRate || null,
        temperature: body.temperature || null,
        // Clinical info
        chiefComplaint: body.chiefComplaint || null,
        symptoms: body.symptoms || null,
        physicalExam: body.physicalExam || null,
        diagnosis: body.diagnosis || null,
        differentialDiagnosis: body.differentialDiagnosis || null,
        treatmentPlan: body.treatmentPlan || null,
        recommendations: body.recommendations || null,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
        notes: body.notes || null,
        // Create prescription if medications provided
        prescriptions: body.medications && body.medications.length > 0 ? {
          create: {
            date: new Date(),
            notes: body.prescriptionNotes || null,
            medications: {
              create: body.medications.map((med: any) => ({
                name: med.name,
                dosage: med.dosage || null,
                frequency: med.frequency || null,
                duration: med.duration || null,
                instructions: med.instructions || null,
                quantity: med.quantity || null,
              })),
            },
          },
        } : undefined,
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        doctor: {
          select: { id: true, name: true },
        },
        prescriptions: {
          include: { medications: true },
        },
      },
    })

    // Update appointment status if linked
    if (body.appointmentId) {
      await prisma.appointment.update({
        where: { id: body.appointmentId },
        data: { status: "COMPLETED" },
      })
    }

    return successResponse(consultation, 201)
  } catch (error) {
    console.error("Error creating consultation:", error)
    return errorResponse("Erreur lors de la création de la consultation", 500)
  }
}

