import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCorsHeaders } from "@/lib/cors"

export async function GET(request: Request) {
  const corsHeaders = getCorsHeaders(request.headers.get("origin"))
  
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const type = searchParams.get("type")

    const where: any = {}
    if (categoryId) where.categoryId = categoryId
    if (type) where.type = type

    const content = await prisma.content.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

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

export async function POST(request: Request) {
  const corsHeaders = getCorsHeaders(request.headers.get("origin"))
  
  try {
    const body = await request.json()
    const { title, description, categoryId, type, duration, thumbnail, videoUrl, content } = body

    const newContent = await prisma.content.create({
      data: {
        title,
        description,
        categoryId,
        type,
        duration,
        thumbnail,
        videoUrl,
        content,
      },
    })

    return NextResponse.json(
      { content: newContent },
      { status: 201, headers: corsHeaders }
    )
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json(
      { error: "Ошибка создания контента" },
      { status: 500, headers: corsHeaders }
    )
  }
}

