"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      price: number;
    };
  }[];
  prescription?: {
    id: string;
    doctorName: string;
    diagnosis: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Cargar órdenes
  const loadOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Error al cargar órdenes");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar las órdenes");
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar estado de orden
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (!response.ok) throw new Error("Error al actualizar orden");
      
      toast.success("Estado actualizado correctamente");
      loadOrders(); // Recargar órdenes
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al actualizar el estado");
    }
  };

  // Eliminar orden
  const deleteOrder = async (orderId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta orden?")) return;

    try {
      const response = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId }),
      });

      if (!response.ok) throw new Error("Error al eliminar orden");
      
      toast.success("Orden eliminada correctamente");
      loadOrders(); // Recargar órdenes
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al eliminar la orden");
    }
  };

  // Cargar órdenes al montar el componente
  useEffect(() => {
    loadOrders();
  }, []);

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PROCESSING":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Órdenes</h1>
      </div>

      {isLoading ? (
        <div>Cargando órdenes...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        updateOrderStatus(order.id, value as OrderStatus)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Cambiar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="PROCESSING">Procesando</SelectItem>
                        <SelectItem value="COMPLETED">Completada</SelectItem>
                        <SelectItem value="CANCELLED">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Ver Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Detalles de la Orden</DialogTitle>
                          <DialogDescription>
                            Información completa de la orden
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold">Información del Cliente</h3>
                            <p>Nombre: {order.user.name}</p>
                            <p>Email: {order.user.email}</p>
                          </div>
                          {order.prescription && (
                            <div>
                              <h3 className="font-semibold">Prescripción Médica</h3>
                              <p>Doctor: {order.prescription.doctorName}</p>
                              <p>Diagnóstico: {order.prescription.diagnosis}</p>
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">Productos</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Producto</TableHead>
                                  <TableHead>Cantidad</TableHead>
                                  <TableHead>Precio</TableHead>
                                  <TableHead>Subtotal</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.product.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                    <TableCell>
                                      ${(item.quantity * item.price).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              Total: ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
} 