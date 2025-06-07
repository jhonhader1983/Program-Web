"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
            <CardDescription>Gestiona el inventario de productos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/products")}>
              Ver Productos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Órdenes</CardTitle>
            <CardDescription>Gestiona las órdenes de compra</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/orders")}>
              Ver Órdenes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prescripciones</CardTitle>
            <CardDescription>Gestiona las prescripciones médicas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard/prescriptions")}>
              Ver Prescripciones
            </Button>
          </CardContent>
        </Card>

        {session?.user.role === "ADMIN" && (
          <Card>
            <CardHeader>
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>Gestiona los usuarios del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/dashboard/users")}>
                Ver Usuarios
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
