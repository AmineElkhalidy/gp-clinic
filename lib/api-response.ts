import { NextResponse } from "next/server"

// Standard API response helpers
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function notFoundResponse(resource = "Resource") {
  return NextResponse.json(
    { success: false, error: `${resource} non trouvé` },
    { status: 404 }
  )
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, error: "Non autorisé" },
    { status: 401 }
  )
}

export function validationErrorResponse(errors: Record<string, string>) {
  return NextResponse.json(
    { success: false, error: "Erreur de validation", details: errors },
    { status: 422 }
  )
}

// Pagination helper
export interface PaginationParams {
  page: number
  limit: number
  total: number
}

export function paginatedResponse<T>(
  data: T[],
  pagination: PaginationParams
) {
  const { page, limit, total } = pagination
  const totalPages = Math.ceil(total / limit)

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  })
}

