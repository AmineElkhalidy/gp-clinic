import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response"

// GET /api/expenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const skip = (page - 1) * limit
    const where: any = {}

    if (category && category !== "all") {
      where.category = category
    }

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          createdBy: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.expense.count({ where }),
    ])

    // Calculate totals
    const totalAmount = await prisma.expense.aggregate({
      where,
      _sum: { amount: true },
    })

    return paginatedResponse(expenses, { page, limit, total })
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return errorResponse("Erreur lors de la récupération des dépenses", 500)
  }
}

// POST /api/expenses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.category || !body.description || !body.amount) {
      return errorResponse("Catégorie, description et montant sont requis")
    }

    const expense = await prisma.expense.create({
      data: {
        createdById: body.createdById,
        date: body.date ? new Date(body.date) : new Date(),
        category: body.category,
        description: body.description,
        amount: parseFloat(body.amount),
        vendor: body.vendor || null,
        receiptUrl: body.receiptUrl || null,
        notes: body.notes || null,
      },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
    })

    return successResponse(expense, 201)
  } catch (error) {
    console.error("Error creating expense:", error)
    return errorResponse("Erreur lors de la création de la dépense", 500)
  }
}

