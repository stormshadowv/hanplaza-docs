import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCorsHeaders } from "@/lib/cors"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: Request) {
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
    const processes = await prisma.businessProcess.findMany({
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Фильтрация по ролям
    const filteredProcesses = processes.filter((process) => {
      // Админы видят всё
      if (user.role === "admin") return true
      
      // Если allowedRoles пустой или "all", доступно всем
      if (!process.allowedRoles || process.allowedRoles === "" || process.allowedRoles === "all") {
        return true
      }
      
      // Проверяем, есть ли роль пользователя в списке разрешенных
      const allowedRolesArray = process.allowedRoles.split(",").map((r) => r.trim())
      return allowedRolesArray.includes(user.role)
    })

    // Parse JSON fields
    const processesWithParsedData = filteredProcesses.map((process) => ({
      ...process,
      departments: JSON.parse(process.departments),
      steps: process.steps.map((step) => ({
        ...step,
        id: step.stepNumber, // Use stepNumber as id for compatibility
        relatedContentIds: step.relatedContentIds ? JSON.parse(step.relatedContentIds) : [],
      })),
    }))

    return NextResponse.json(
      { processes: processesWithParsedData },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error fetching processes:", error)
    return NextResponse.json(
      { error: "Ошибка получения процессов" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function POST(request: Request) {
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
    const body = await request.json()
    const { name, description, departments, steps, allowedRoles } = body

    const process = await prisma.businessProcess.create({
      data: {
        name,
        description,
        departments: JSON.stringify(departments),
        allowedRoles: allowedRoles || "",
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
      { status: 201, headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error creating process:", error)
    return NextResponse.json(
      { error: "Ошибка создания процесса" },
      { status: 500, headers: corsHeaders }
    )
  }
}

