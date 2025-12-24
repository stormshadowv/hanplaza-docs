import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCorsHeaders } from "@/lib/cors"
import { verifyToken } from "@/lib/jwt"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(request.headers.get("origin"))
  
  // Проверка аутентификации
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401, headers: corsHeaders }
    )
  }

  const user = verifyToken(token)
  if (!user) {
    return NextResponse.json(
      { error: "Неверный токен" },
      { status: 401, headers: corsHeaders }
    )
  }

  try {
    const params = await context.params
    console.log("Process ID requested:", params.id)
    
    const process = await prisma.businessProcess.findUnique({
      where: { id: params.id },
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
        },
      },
    })

    if (!process) {
      return NextResponse.json(
        { error: "Процесс не найден" },
        { status: 404, headers: corsHeaders }
      )
    }

    // Проверка прав доступа
    if (user.role !== "admin") {
      if (process.allowedRoles && process.allowedRoles !== "" && process.allowedRoles !== "all") {
        const allowedRolesArray = process.allowedRoles.split(",").map((r) => r.trim())
        if (!allowedRolesArray.includes(user.role)) {
          return NextResponse.json(
            { error: "Доступ запрещен" },
            { status: 403, headers: corsHeaders }
          )
        }
      }
    }

    // Parse JSON fields
    const processWithParsedData = {
      ...process,
      departments: JSON.parse(process.departments),
      steps: process.steps.map((step) => ({
        ...step,
        id: step.stepNumber, // Use stepNumber as id for compatibility
        relatedContentIds: step.relatedContentIds ? JSON.parse(step.relatedContentIds) : [],
      })),
    }

    return NextResponse.json(
      { process: processWithParsedData },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error fetching process:", error)
    return NextResponse.json(
      { error: "Ошибка получения процесса" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(request.headers.get("origin"))
  
  // Проверка аутентификации и прав администратора
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401, headers: corsHeaders }
    )
  }

  const user = verifyToken(token)
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { error: "Доступ запрещен. Требуются права администратора" },
      { status: 403, headers: corsHeaders }
    )
  }

  try {
    const params = await context.params
    const body = await request.json()
    const { name, description, departments, steps, allowedRoles } = body

    // Delete old steps
    await prisma.processStep.deleteMany({
      where: { processId: params.id },
    })

    // Update process with new steps
    const process = await prisma.businessProcess.update({
      where: { id: params.id },
      data: {
        name,
        description,
        departments: JSON.stringify(departments),
        allowedRoles: allowedRoles !== undefined ? allowedRoles : "",
        steps: {
          create: steps.map((step: any, index: number) => ({
            stepNumber: index + 1,
            title: step.title,
            description: step.description,
            responsible: step.responsible,
            duration: step.duration,
            relatedContentIds: JSON.stringify(step.relatedContentIds || []),
          })),
        },
      },
      include: {
        steps: true,
      },
    })

    return NextResponse.json(
      { process },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error updating process:", error)
    return NextResponse.json(
      { error: "Ошибка обновления процесса" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(request.headers.get("origin"))
  
  // Проверка аутентификации и прав администратора
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401, headers: corsHeaders }
    )
  }

  const user = verifyToken(token)
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { error: "Доступ запрещен. Требуются права администратора" },
      { status: 403, headers: corsHeaders }
    )
  }

  try {
    const params = await context.params
    await prisma.businessProcess.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { success: true, message: "Процесс удален" },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error deleting process:", error)
    return NextResponse.json(
      { error: "Ошибка удаления процесса" },
      { status: 500, headers: corsHeaders }
    )
  }
}

