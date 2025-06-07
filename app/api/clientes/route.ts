// app/api/clients/route.ts
import { NextResponse } from "next/server";

// Simulación de base de datos
const mockClients = [
  { id: 1, nombre: "Juan", correo: "juan@mail.com" },
  { id: 2, nombre: "Ana", correo: "ana@mail.com" },
];

// GET: Lista de clientes
export async function GET() {
  return NextResponse.json(mockClients);
}

// POST: Crear nuevo cliente
export async function POST(req: Request) {
  const data = await req.json();

  if (!data.nombre || !data.correo) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const newClient = {
    id: Date.now(),
    nombre: data.nombre,
    correo: data.correo,
  };

  mockClients.push(newClient);

  return NextResponse.json(newClient, { status: 201 });
}
