import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCorsHeaders } from "@/lib/cors"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const corsHeaders = getCorsHeaders(request.headers.get("origin"))
  
  try {
    const content = await prisma.content.findUnique({
      where: { id: params.id },
    })

    if (!content) {
      return NextResponse.json(
        { error: "Контент не найден" },
        { status: 404, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      { content },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json(
      { error: "Ошибка получения контента" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const corsHeaders = getCorsHeaders(request.headers.get("origin"))
  
  try {
    const body = await request.json()
    
    if (body.action === "increment_views") {
      const content = await prisma.content.update({
        where: { id: params.id },
        data: { views: { increment: 1 } },
      })
      
      return NextResponse.json(
        { content },
        { headers: corsHeaders }
      )
    }

    const updatedContent = await prisma.content.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(
      { content: updatedContent },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json(
      { error: "Ошибка обновления контента" },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const corsHeaders = getCorsHeaders(request.headers.get("origin"))
  
  try {
    await prisma.content.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { success: true, message: "Контент удален" },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error deleting content:", error)
    return NextResponse.json(
      { error: "Ошибка удаления контента" },
      { status: 500, headers: corsHeaders }
    )
  }
}

