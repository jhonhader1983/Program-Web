import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Listar todas las órdenes
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 });
    }
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, price: true } },
          },
        },
        prescription: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

// Crear una nueva orden
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 });
    }
    const body = await req.json();
    const { items, total, prescriptionId } = body;
    if (!items || !Array.isArray(items) || items.length === 0 || !total) {
      return new NextResponse("Datos incompletos", { status: 400 });
    }
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: parseFloat(total),
        prescriptionId: prescriptionId || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_POST]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

// Actualizar estado de una orden
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 });
    }
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return new NextResponse("Datos incompletos", { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDERS_PATCH]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

// Eliminar una orden
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 });
    }
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return new NextResponse("ID requerido", { status: 400 });
    }
    await prisma.order.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ORDERS_DELETE]", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
} 