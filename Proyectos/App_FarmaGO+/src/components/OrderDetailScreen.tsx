import { useState } from "react";
import { 
  ArrowLeft,
  Package, 
  User, 
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Store,
  Truck,
  ClipboardCheck,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";
import { Separator } from "./ui/separator";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderStatusHistory {
  status: string;
  date: string;
  time: string;
  description: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDNI: string;
  date: string;
  time: string;
  total: number;
  status: "En Proceso" | "Enviado" | "Entregado" | "Completado" | "Cancelado" | "Devolución Solicitada" | "Devuelto";
  deliveryType: "Domicilio" | "Retiro en Mostrador";
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
  notes?: string;
  statusHistory: OrderStatusHistory[];
}

interface OrderDetailScreenProps {
  orderId: string;
  onBack: () => void;
  onOrderComplete: (orderId: string, completionType: string) => void;
}

export function OrderDetailScreen({ orderId, onBack, onOrderComplete }: OrderDetailScreenProps) {
  // Mock data - en producción vendría de una API
  const [order, setOrder] = useState<Order>({
    id: orderId,
    customerName: "Juan Pérez",
    customerEmail: "juan.perez@email.com",
    customerPhone: "+54 221 456-7890",
    customerDNI: "35.456.789",
    date: "14/11/2024",
    time: "10:30",
    total: 3450.00,
    status: "En Proceso",
    deliveryType: "Domicilio",
    items: [
      { 
        id: "P001", 
        name: "Ibuprofeno 400mg", 
        quantity: 2, 
        price: 350.00,
      },
      { 
        id: "P003", 
        name: "Amoxicilina 500mg", 
        quantity: 3, 
        price: 890.00,
      },
      { 
        id: "P005", 
        name: "Omeprazol 20mg", 
        quantity: 1, 
        price: 520.00,
      },
    ],
    deliveryAddress: "Calle 7 N° 822, La Plata, Buenos Aires",
    paymentMethod: "Visa **** 4242",
    notes: "Dejar con el portero si no hay nadie. Timbre 2B.",
    statusHistory: [
      {
        status: "Pedido Recibido",
        date: "14/11/2024",
        time: "10:30",
        description: "Pedido recibido y confirmado"
      },
      {
        status: "En Preparación",
        date: "14/11/2024",
        time: "10:45",
        description: "Productos en proceso de preparación"
      },
    ]
  });

  const [showPickupDialog, setShowPickupDialog] = useState(false);
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
  const [pickupReceiverName, setPickupReceiverName] = useState("");
  const [pickupReceiverDNI, setPickupReceiverDNI] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [deliveryReceiverName, setDeliveryReceiverName] = useState("");
  const [deliveryReceiverDNI, setDeliveryReceiverDNI] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Completado":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completado
          </Badge>
        );
      case "Entregado":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            <CheckCircle className="h-4 w-4 mr-1" />
            Entregado
          </Badge>
        );
      case "Enviado":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Truck className="h-4 w-4 mr-1" />
            Enviado
          </Badge>
        );
      case "En Proceso":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            <Clock className="h-4 w-4 mr-1" />
            En Proceso
          </Badge>
        );
      case "Cancelado":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            <XCircle className="h-4 w-4 mr-1" />
            Cancelado
          </Badge>
        );
      case "Devolución Solicitada":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Devolución Solicitada
          </Badge>
        );
      case "Devuelto":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            <RefreshCw className="h-4 w-4 mr-1" />
            Devuelto
          </Badge>
        );
    }
  };

  const canCompleteOrder = () => {
    return order.status === "En Proceso" || order.status === "Enviado" || order.status === "Entregado";
  };

  const handlePickupConfirm = () => {
    if (!pickupReceiverName.trim() || !pickupReceiverDNI.trim()) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Actualizar el pedido
    const updatedOrder = {
      ...order,
      status: "Completado" as const,
      statusHistory: [
        ...order.statusHistory,
        {
          status: "Completado - Retiro en Mostrador",
          date: new Date().toLocaleDateString('es-AR'),
          time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
          description: `Retirado por ${pickupReceiverName} (DNI: ${pickupReceiverDNI}). ${pickupNotes || 'Sin observaciones.'}`
        }
      ]
    };

    setOrder(updatedOrder);
    onOrderComplete(order.id, "pickup");
    setShowPickupDialog(false);
    
    toast.success(
      <div>
        <p className="font-semibold">Pedido completado exitosamente</p>
        <p className="text-sm">Retiro en mostrador registrado. Inventario actualizado.</p>
      </div>
    );

    // Reset form
    setPickupReceiverName("");
    setPickupReceiverDNI("");
    setPickupNotes("");
  };

  const handleDeliveryConfirm = () => {
    if (!deliveryReceiverName.trim() || !deliveryReceiverDNI.trim()) {
      toast.error("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Actualizar el pedido
    const updatedOrder = {
      ...order,
      status: "Completado" as const,
      statusHistory: [
        ...order.statusHistory,
        {
          status: "Completado - Entrega a Domicilio",
          date: new Date().toLocaleDateString('es-AR'),
          time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
          description: `Entregado a ${deliveryReceiverName} (DNI: ${deliveryReceiverDNI}). ${deliveryNotes || 'Sin observaciones.'}`
        }
      ]
    };

    setOrder(updatedOrder);
    onOrderComplete(order.id, "delivery");
    setShowDeliveryDialog(false);
    
    toast.success(
      <div>
        <p className="font-semibold">Pedido completado exitosamente</p>
        <p className="text-sm">Entrega a domicilio registrada. Inventario actualizado.</p>
      </div>
    );

    // Reset form
    setDeliveryReceiverName("");
    setDeliveryReceiverDNI("");
    setDeliveryNotes("");
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-semibold">Detalle del Pedido {order.id}</h2>
              <p className="text-emerald-50">Gestión completa del pedido</p>
            </div>
          </div>
          <div className="text-right">
            {getStatusBadge(order.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nombre Completo</p>
                      <p className="font-semibold text-emerald-900">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-emerald-900">{order.customerEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-semibold text-emerald-900">{order.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
                      <ClipboardCheck className="h-5 w-5 text-orange-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">DNI</p>
                      <p className="font-semibold text-emerald-900">{order.customerDNI}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <Package className="h-5 w-5" />
                Productos del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-emerald-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Cantidad: {item.quantity} unidades</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-700">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">c/u</p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && <Separator className="my-3" />}
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white">
                <span className="text-lg font-semibold">Total del Pedido</span>
                <span className="text-2xl font-bold">${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                {order.deliveryType === "Domicilio" ? (
                  <>
                    <Truck className="h-5 w-5" />
                    Información de Entrega
                  </>
                ) : (
                  <>
                    <Store className="h-5 w-5" />
                    Información de Retiro
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-700 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Dirección de entrega</p>
                    <p className="font-semibold text-blue-900">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-emerald-700" />
                    <p className="text-sm text-gray-600">Fecha</p>
                  </div>
                  <p className="font-semibold text-emerald-900">{order.date}</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-teal-700" />
                    <p className="text-sm text-gray-600">Hora</p>
                  </div>
                  <p className="font-semibold text-teal-900">{order.time}</p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-purple-700" />
                  <div>
                    <p className="text-sm text-gray-600">Método de Pago</p>
                    <p className="font-semibold text-purple-900">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm text-gray-600 mb-1">Notas del pedido</p>
                  <p className="text-sm text-yellow-900 italic">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Complete Order Actions */}
          {canCompleteOrder() && order.status !== "Completado" && (
            <Card className="border-4 border-emerald-300 shadow-2xl bg-gradient-to-br from-white to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-6 w-6" />
                  Finalizar Pedido
                </CardTitle>
                <CardDescription className="text-emerald-50">
                  Registra la finalización del pedido
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    ⚠️ Al completar el pedido:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                    <li>El inventario se actualizará automáticamente</li>
                    <li>El cliente recibirá una notificación</li>
                    <li>El pedido se marcará como completado</li>
                  </ul>
                </div>

                <Button
                  onClick={() => setShowPickupDialog(true)}
                  className="w-full h-auto py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Store className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-base">Retiro en Mostrador</p>
                      <p className="text-xs text-emerald-100">Cliente recoge en farmacia</p>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => setShowDeliveryDialog(true)}
                  className="w-full h-auto py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-base">Entrega a Domicilio</p>
                      <p className="text-xs text-blue-100">Pedido entregado al cliente</p>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Order completed message */}
          {order.status === "Completado" && (
            <Card className="border-4 border-emerald-300 shadow-2xl bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-emerald-900 text-lg">Pedido Completado</h3>
                  <p className="text-sm text-gray-600">
                    Este pedido ha sido finalizado exitosamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Status History */}
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <Clock className="h-5 w-5" />
                Historial de Estados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="relative pl-6 pb-4 border-l-2 border-emerald-300 last:border-l-0 last:pb-0">
                    <div className="absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
                    <div className="space-y-1">
                      <p className="font-semibold text-emerald-900 text-sm">{history.status}</p>
                      <p className="text-xs text-gray-600">{history.date} - {history.time}</p>
                      <p className="text-xs text-gray-500">{history.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pickup Dialog */}
      <Dialog open={showPickupDialog} onOpenChange={setShowPickupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-900">
              <Store className="h-6 w-6" />
              Registrar Retiro en Mostrador
            </DialogTitle>
            <DialogDescription>
              Completa los datos de la persona que retira el pedido
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-800">
                <strong>Pedido:</strong> {order.id}
              </p>
              <p className="text-sm text-emerald-800">
                <strong>Cliente:</strong> {order.customerName}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupName">Nombre de quien retira *</Label>
              <Input
                id="pickupName"
                placeholder="Nombre completo"
                value={pickupReceiverName}
                onChange={(e) => setPickupReceiverName(e.target.value)}
                className="border-emerald-200 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDNI">DNI de quien retira *</Label>
              <Input
                id="pickupDNI"
                placeholder="XX.XXX.XXX"
                value={pickupReceiverDNI}
                onChange={(e) => setPickupReceiverDNI(e.target.value)}
                className="border-emerald-200 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupNotes">Observaciones (opcional)</Label>
              <Textarea
                id="pickupNotes"
                placeholder="Ej: Presentó autorización del titular..."
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                rows={3}
                className="border-emerald-200 focus:ring-emerald-500"
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Importante:</strong> Verifica que la persona que retira esté autorizada. Al confirmar, el pedido pasará a estado "Completado" y se actualizará el inventario.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowPickupDialog(false)}
              className="border-emerald-300 text-emerald-700"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handlePickupConfirm}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Store className="h-4 w-4 mr-2" />
              Confirmar Retiro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delivery Dialog */}
      <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-900">
              <Truck className="h-6 w-6" />
              Registrar Entrega a Domicilio
            </DialogTitle>
            <DialogDescription>
              Completa los datos de la persona que recibe el pedido
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Pedido:</strong> {order.id}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Cliente:</strong> {order.customerName}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Dirección:</strong> {order.deliveryAddress}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryName">Nombre de quien recibe *</Label>
              <Input
                id="deliveryName"
                placeholder="Nombre completo"
                value={deliveryReceiverName}
                onChange={(e) => setDeliveryReceiverName(e.target.value)}
                className="border-blue-200 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDNI">DNI de quien recibe *</Label>
              <Input
                id="deliveryDNI"
                placeholder="XX.XXX.XXX"
                value={deliveryReceiverDNI}
                onChange={(e) => setDeliveryReceiverDNI(e.target.value)}
                className="border-blue-200 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryNotes">Observaciones (opcional)</Label>
              <Textarea
                id="deliveryNotes"
                placeholder="Ej: Entregado al portero del edificio..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                rows={3}
                className="border-blue-200 focus:ring-blue-500"
              />
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-xs text-orange-800">
                <strong>Importante:</strong> Confirma que el pedido fue entregado correctamente. Al confirmar, el pedido pasará a estado "Completado" y se actualizará el inventario.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowDeliveryDialog(false)}
              className="border-blue-300 text-blue-700"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeliveryConfirm}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Truck className="h-4 w-4 mr-2" />
              Confirmar Entrega
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
