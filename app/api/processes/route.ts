import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { corsHeaders } from "@/lib/cors"

export async function GET() {
  try {
    const processes = await prisma.businessProcess.findMany({
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Parse JSON fields
    const processesWithParsedData = processes.map((process) => ({
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
  try {
    const body = await request.json()
    const { name, description, departments, steps } = body

    const process = await prisma.businessProcess.create({
      data: {
        name,
        description,
        departments: JSON.stringify(departments),
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

