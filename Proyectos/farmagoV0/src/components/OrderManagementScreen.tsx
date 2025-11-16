import { useState } from "react";
import { 
  ClipboardList, 
  Package, 
  Search, 
  Eye, 
  XCircle, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  total: number;
  status: "En Proceso" | "Enviado" | "Entregado" | "Completado" | "Cancelado" | "Devolución Solicitada" | "Devuelto";
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
  canCancel: boolean;
  canReturn: boolean;
}

interface OrderManagementScreenProps {
  onNavigateToDetail?: (orderId: string) => void;
}

export function OrderManagementScreen({ onNavigateToDetail }: OrderManagementScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("todos");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnType, setReturnType] = useState("");

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#P-1008",
      customerName: "Juan Pérez",
      customerEmail: "juan.perez@email.com",
      customerPhone: "+54 221 456-7890",
      date: "14/11/2024",
      total: 3450.00,
      status: "En Proceso",
      items: [
        { id: "P001", name: "Ibuprofeno 400mg", quantity: 2, price: 350.00 },
        { id: "P003", name: "Amoxicilina 500mg", quantity: 3, price: 890.00 },
      ],
      deliveryAddress: "Calle 7 N° 822, La Plata, Buenos Aires",
      paymentMethod: "Visa **** 4242",
      canCancel: true,
      canReturn: false,
    },
    {
      id: "#P-1007",
      customerName: "María González",
      customerEmail: "maria.gonzalez@email.com",
      customerPhone: "+54 221 555-1234",
      date: "13/11/2024",
      total: 1850.00,
      status: "Enviado",
      items: [
        { id: "P005", name: "Omeprazol 20mg", quantity: 2, price: 520.00 },
        { id: "P006", name: "Loratadina 10mg", quantity: 2, price: 380.00 },
      ],
      deliveryAddress: "Av. 51 N° 1234, La Plata, Buenos Aires",
      paymentMethod: "Mastercard **** 8888",
      canCancel: false,
      canReturn: true,
    },
    {
      id: "#P-1006",
      customerName: "Carlos Rodríguez",
      customerEmail: "carlos.rodriguez@email.com",
      customerPhone: "+54 221 333-9876",
      date: "12/11/2024",
      total: 2200.00,
      status: "Completado",
      items: [
        { id: "P008", name: "Vitamina C 1000mg", quantity: 2, price: 680.00 },
        { id: "P004", name: "Alcohol en Gel 500ml", quantity: 2, price: 450.00 },
      ],
      deliveryAddress: "Calle 13 N° 567, La Plata, Buenos Aires",
      paymentMethod: "Visa **** 1111",
      canCancel: false,
      canReturn: false,
    },
    {
      id: "#P-1005",
      customerName: "Ana Martínez",
      customerEmail: "ana.martinez@email.com",
      customerPhone: "+54 221 777-4444",
      date: "11/11/2024",
      total: 4500.00,
      status: "Devolución Solicitada",
      items: [
        { id: "P007", name: "Atorvastatina 20mg", quantity: 2, price: 1250.00 },
        { id: "P003", name: "Amoxicilina 500mg", quantity: 2, price: 890.00 },
      ],
      deliveryAddress: "Diagonal 74 N° 890, La Plata, Buenos Aires",
      paymentMethod: "Mastercard **** 5555",
      canCancel: false,
      canReturn: false,
    },
    {
      id: "#P-1004",
      customerName: "Pedro López",
      customerEmail: "pedro.lopez@email.com",
      customerPhone: "+54 221 888-2222",
      date: "10/11/2024",
      total: 950.00,
      status: "Cancelado",
      items: [
        { id: "P002", name: "Paracetamol 500mg", quantity: 2, price: 280.00 },
      ],
      deliveryAddress: "Calle 50 N° 123, La Plata, Buenos Aires",
      paymentMethod: "Visa **** 9999",
      canCancel: false,
      canReturn: false,
    },
    {
      id: "#P-1003",
      customerName: "Lucía Fernández",
      customerEmail: "lucia.fernandez@email.com",
      customerPhone: "+54 221 444-3333",
      date: "09/11/2024",
      total: 3200.00,
      status: "Completado",
      items: [
        { id: "P001", name: "Ibuprofeno 400mg", quantity: 3, price: 350.00 },
        { id: "P007", name: "Atorvastatina 20mg", quantity: 1, price: 1250.00 },
      ],
      deliveryAddress: "Calle 60 N° 456, La Plata, Buenos Aires",
      paymentMethod: "Visa **** 2222",
      canCancel: false,
      canReturn: false,
    },
    {
      id: "#P-1002",
      customerName: "Roberto Sánchez",
      customerEmail: "roberto.sanchez@email.com",
      customerPhone: "+54 221 666-7777",
      date: "08/11/2024",
      total: 1580.00,
      status: "Completado",
      items: [
        { id: "P005", name: "Omeprazol 20mg", quantity: 2, price: 520.00 },
        { id: "P002", name: "Paracetamol 500mg", quantity: 2, price: 280.00 },
      ],
      deliveryAddress: "Av. 7 N° 1020, La Plata, Buenos Aires",
      paymentMethod: "Mastercard **** 3333",
      canCancel: false,
      canReturn: false,
    },
  ]);

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Entregado":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Entregado
          </Badge>
        );
      case "Enviado":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            <MapPin className="h-3 w-3 mr-1" />
            Enviado
          </Badge>
        );
      case "En Proceso":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            En Proceso
          </Badge>
        );
      case "Cancelado":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      case "Devolución Solicitada":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Devolución Solicitada
          </Badge>
        );
      case "Devuelto":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            <RefreshCw className="h-3 w-3 mr-1" />
            Devuelto
          </Badge>
        );
      case "Completado":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setCancelReason("");
    setShowCancelDialog(true);
  };

  const handleReturnOrder = (order: Order) => {
    setSelectedOrder(order);
    setReturnReason("");
    setReturnType("");
    setShowReturnDialog(true);
  };

  const confirmCancelOrder = () => {
    if (!cancelReason.trim()) {
      toast.error("Por favor, proporciona una razón para la cancelación.");
      return;
    }

    if (selectedOrder) {
      setOrders(orders.map(o => 
        o.id === selectedOrder.id 
          ? { ...o, status: "Cancelado", canCancel: false, canReturn: false }
          : o
      ));
      toast.success(`Pedido ${selectedOrder.id} cancelado exitosamente.`);
      setShowCancelDialog(false);
      setCancelReason("");
    }
  };

  const confirmReturnOrder = () => {
    if (!returnReason.trim() || !returnType) {
      toast.error("Por favor, completa todos los campos de la devolución.");
      return;
    }

    if (selectedOrder) {
      setOrders(orders.map(o => 
        o.id === selectedOrder.id 
          ? { ...o, status: "Devuelto", canCancel: false, canReturn: false }
          : o
      ));
      toast.success(`Devolución del pedido ${selectedOrder.id} procesada exitosamente.`);
      setShowReturnDialog(false);
      setReturnReason("");
      setReturnType("");
    }
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      enProceso: orders.filter(o => o.status === "En Proceso").length,
      enviados: orders.filter(o => o.status === "Enviado").length,
      entregados: orders.filter(o => o.status === "Entregado").length,
      cancelados: orders.filter(o => o.status === "Cancelado").length,
      devoluciones: orders.filter(o => o.status === "Devolución Solicitada" || o.status === "Devuelto").length,
    };
  };

  const stats = getOrderStats();

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Gestión de Pedidos</h2>
            <p className="text-emerald-50">Administra cancelaciones y devoluciones</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-2 border-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-emerald-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.enProceso}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enviados</p>
                <p className="text-2xl font-bold text-blue-700">{stats.enviados}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entregados</p>
                <p className="text-2xl font-bold text-emerald-700">{stats.entregados}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelados</p>
                <p className="text-2xl font-bold text-red-700">{stats.cancelados}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Devoluciones</p>
                <p className="text-2xl font-bold text-orange-700">{stats.devoluciones}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2 border-emerald-100">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por ID de pedido, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-emerald-200 focus:ring-emerald-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-emerald-200">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Enviado">Enviado</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
                <SelectItem value="Devolución Solicitada">Devolución Solicitada</SelectItem>
                <SelectItem value="Devuelto">Devuelto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-2 border-emerald-100 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
          <CardTitle className="text-emerald-900">Listado de Pedidos</CardTitle>
          <CardDescription>Gestiona cancelaciones y devoluciones de forma eficiente</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No se encontraron pedidos</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-emerald-900">ID Pedido</TableHead>
                  <TableHead className="text-emerald-900">Cliente</TableHead>
                  <TableHead className="text-emerald-900">Fecha</TableHead>
                  <TableHead className="text-emerald-900">Total</TableHead>
                  <TableHead className="text-emerald-900">Estado</TableHead>
                  <TableHead className="text-right text-emerald-900">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-emerald-50/50">
                    <TableCell className="font-semibold text-emerald-700">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="font-semibold text-emerald-700">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 flex-wrap">
                        {onNavigateToDetail && (
                          <Button 
                            size="sm"
                            onClick={() => onNavigateToDetail(order.id)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                          >
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Gestionar
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                          className="hover:bg-emerald-100 text-emerald-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        {order.canCancel && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCancelOrder(order)}
                            className="hover:bg-red-100 text-red-700"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        )}
                        {order.canReturn && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReturnOrder(order)}
                            className="hover:bg-orange-100 text-orange-700"
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Devolución
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-emerald-900">Detalles del Pedido {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Información completa del pedido</DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Cliente
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Nombre:</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Teléfono:</p>
                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fecha:</p>
                    <p className="font-medium">{selectedOrder.date}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección de Entrega
                </h4>
                <p className="text-sm">{selectedOrder.deliveryAddress}</p>
              </div>

              {/* Items */}
              <div className="p-4 bg-white rounded-xl border-2 border-emerald-200">
                <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Productos
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-emerald-700">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Método de Pago:</p>
                    <p className="font-medium">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total:</p>
                    <p className="text-2xl font-bold text-emerald-700">${selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex justify-center">
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              onClick={() => setShowDetailsDialog(false)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-900 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Cancelar Pedido {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Esta acción cancelará el pedido y actualizará el inventario. Por favor, proporciona una razón.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cancelReason">Razón de Cancelación *</Label>
              <Textarea
                id="cancelReason"
                placeholder="Ej: Producto sin stock, solicitud del cliente, error en el pedido..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="border-red-200 focus:ring-red-500"
              />
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800">
                <strong>Nota:</strong> Al cancelar este pedido, los productos volverán al inventario automáticamente.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className="border-emerald-300 text-emerald-700"
            >
              Volver
            </Button>
            <Button 
              onClick={confirmCancelOrder}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Order Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-orange-900 flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Procesar Devolución {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Gestiona la devolución del pedido y actualiza el inventario según corresponda.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="returnType">Tipo de Devolución *</Label>
              <Select value={returnType} onValueChange={setReturnType}>
                <SelectTrigger className="border-orange-200">
                  <SelectValue placeholder="Selecciona el tipo de devolución" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Devolución Total</SelectItem>
                  <SelectItem value="parcial">Devolución Parcial</SelectItem>
                  <SelectItem value="defectuoso">Producto Defectuoso</SelectItem>
                  <SelectItem value="insatisfaccion">Insatisfacción del Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="returnReason">Detalles de la Devolución *</Label>
              <Textarea
                id="returnReason"
                placeholder="Describe los detalles de la devolución, condición de los productos, etc..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={4}
                className="border-orange-200 focus:ring-orange-500"
              />
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>Importante:</strong> Los productos devueltos se agregarán nuevamente al inventario después de la verificación de calidad.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setShowReturnDialog(false)}
              className="border-emerald-300 text-emerald-700"
            >
              Volver
            </Button>
            <Button 
              onClick={confirmReturnOrder}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Procesar Devolución
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}