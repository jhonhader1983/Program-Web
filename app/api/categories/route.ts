import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const categories = await prisma.category.findMany();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse("El nombre es requerido", { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
} 