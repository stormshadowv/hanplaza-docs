import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { corsHeaders } from "@/lib/cors"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, departments, steps } = body

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
  { params }: { params: { id: string } }
) {
  try {
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

