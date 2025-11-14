import React, { useEffect, useState } from "react";
import { Package, MapPin, Clock, Phone, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface PedidoItem {
  id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

interface Pedido {
  id: number;
  cliente_nombre?: string;
  status: string;
  total: number;
  creado_at?: string;
  items: PedidoItem[];
}

export function PharmacyOrdersScreen() {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/orders");
      if (!res.ok) throw new Error("Error al obtener pedidos");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar los pedidos. Revisa backend.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id: number) => {
    if (!confirm("¿Confirmar cancelación del pedido?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/orders/${id}/cancel`, { method: "POST" });
      if (!res.ok) throw new Error("Error al cancelar");
      alert("Pedido cancelado");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("No se pudo cancelar el pedido.");
    }
  };

  const pickupOrder = async (id: number) => {
    if (!confirm("Confirmar retiro en mostrador?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/orders/${id}/pickup`, { method: "POST" });
      if (!res.ok) throw new Error("Error al marcar retiro");
      alert("Pedido marcado como retirado");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("No se pudo marcar el retiro.");
    }
  };

  const deliverOrder = async (id: number) => {
    if (!confirm("Confirmar entrega del pedido?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/orders/${id}/deliver`, { method: "POST" });
      if (!res.ok) throw new Error("Error al marcar entrega");
      alert("Pedido marcado como entregado");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("No se pudo marcar la entrega.");
    }
  };

  const printReceipt = (id: number) => {
    // Preferir PDF generado por backend (si está disponible)
    const url = `http://localhost:8000/api/v1/orders/${id}/receipt.pdf`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const returnOrder = async (id: number) => {
    const reason = prompt("Motivo de la devolución (opcional):") || undefined;
    try {
      let url = `http://localhost:8000/api/v1/orders/${id}/return`;
      if (reason) url += `?reason=${encodeURIComponent(reason)}`;
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("Error al devolver");
      alert("Pedido marcado como devuelto");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("No se pudo procesar la devolución.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case "in-transit":
        return <Badge className="bg-emerald-500">En Camino</Badge>;
      case "picked-up":
        return <Badge className="bg-gray-700">Retirado</Badge>;
      case "delivered":
        return <Badge className="bg-gray-500">Entregado</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelado</Badge>;
      case "returned":
        return <Badge className="bg-orange-500">Devuelto</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Gestión de Pedidos - Farmacia</h2>
        <p className="text-emerald-50">Lista de pedidos y acciones (cancelar / devolver)</p>
      </div>

      {loading ? (
        <div>Cargando pedidos...</div>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 && <div className="text-sm text-gray-600">No hay pedidos disponibles.</div>}

          {orders.map((order) => (
            <Card key={order.id} className="border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{order.cliente_nombre || "Cliente"}</CardTitle>
                      <p className="text-sm text-gray-600">{`ID: ${order.id}`}</p>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.items.length} artículos</p>
                      <p className="text-xs text-gray-600">{`Total: $${order.total}`}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Creado</p>
                      <p className="text-xs text-gray-600">{order.creado_at || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                    {/* Mostrar 'Cancelar' sólo si el pedido está pendiente o en tránsito */}
                    {(order.status === "pending" || order.status === "in-transit") && (
                      <Button className="bg-red-500 hover:bg-red-600" onClick={() => cancelOrder(order.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    )}

                    {/* Mostrar 'Devolver' sólo si ya fue entregado o retirado */}
                    {(order.status === "delivered" || order.status === "picked-up") && (
                      <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50" onClick={() => returnOrder(order.id)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Devolver
                      </Button>
                    )}

                  {/* Marcar retiro en mostrador */}
                  {order.status === "pending" && (
                    <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => pickupOrder(order.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Retiro en mostrador
                    </Button>
                  )}

                  {/* Marcar entrega */}
                  {order.status === "in-transit" || order.status === "pending" ? (
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => deliverOrder(order.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar Entregado
                    </Button>
                  ) : null}

                  {/* Imprimir comprobante siempre disponible para pedidos cerrados */}
                  {order.status === "delivered" || order.status === "picked-up" || order.status === "pending" ? (
                    <Button variant="ghost" className="text-emerald-700" onClick={() => printReceipt(order.id)}>
                      Imprimir Comprobante
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
