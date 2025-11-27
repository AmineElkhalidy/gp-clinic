import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response"

// GET /api/expenses/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
    })

    if (!expense) {
      return notFoundResponse("Dépense")
    }

    return successResponse(expense)
  } catch (error) {
    console.error("Error fetching expense:", error)
    return errorResponse("Erreur lors de la récupération de la dépense", 500)
  }
}

// PUT /api/expenses/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!existingExpense) {
      return notFoundResponse("Dépense")
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        date: body.date ? new Date(body.date) : undefined,
        category: body.category,
        description: body.description,
        amount: body.amount ? parseFloat(body.amount) : undefined,
        vendor: body.vendor,
        receiptUrl: body.receiptUrl,
        notes: body.notes,
      },
    })

    return successResponse(expense)
  } catch (error) {
    console.error("Error updating expense:", error)
    return errorResponse("Erreur lors de la mise à jour de la dépense", 500)
  }
}

// DELETE /api/expenses/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    })

    if (!existingExpense) {
      return notFoundResponse("Dépense")
    }

    await prisma.expense.delete({
      where: { id },
    })

    return successResponse({ message: "Dépense supprimée avec succès" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return errorResponse("Erreur lors de la suppression de la dépense", 500)
  }
}

