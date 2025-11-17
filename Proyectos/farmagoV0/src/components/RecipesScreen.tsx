import { useState, useEffect } from "react";
import { FileText, Package, Eye, Download, CheckCircle, Clock, XCircle, MapPin, CreditCard, Loader2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
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
  DialogTrigger,
} from "./ui/dialog"; 
// ¡Importamos la 'interface' del Padre!
import { type Order } from "../App"; 

interface Prescription {
  id: string;
  name: string;
  doctor: string;
  date: string;
  status: "Aprobado" | "Pendiente" | "Rechazado";
}

// --- (Props que nos pasa App.tsx) ---
interface RecipesScreenProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export function RecipesScreen({ orders, setOrders }: RecipesScreenProps) {
  const [activeTab, setActiveTab] = useState("prescriptions");
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- (La maqueta de 'prescriptions' sigue igual) ---
  const prescriptions: Prescription[] = [
    {
      id: "RX-1001",
      name: "Ibuprofeno 600mg",
      doctor: "Dr. Juan García",
      date: "10/11/2024",
      status: "Aprobado"
    },
    // ... (el resto de las recetas estáticas)
  ];

  // --- ¡¡¡CAMBIO!!! ¡Arreglamos el 'status | undefined'! ---
  const getStatusBadge = (status: Prescription["status"] | undefined) => {
    if (!status) return null; // ¡Chequeo por si las moscas!
    switch (status) {
      case "Aprobado":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobado
          </Badge>
        );
      case "Pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "Rechazado":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        );
    }
  };

  // --- ¡¡¡CAMBIO!!! ¡Arreglamos el 'status | undefined'! ---
  const getOrderStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge>Desconocido</Badge>; // ¡Chequeo!
    switch (status.toLowerCase()) {
      case "entregado":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Entregado
          </Badge>
        );
      case "enviado":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            <MapPin className="h-3 w-3 mr-1" />
            Enviado
          </Badge>
        );
      case "en proceso":
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      case "cancelado":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // --- ¡¡¡CAMBIO!!! ¡Arreglamos el 'dateString | undefined'! ---
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Fecha no disponible"; // ¡Chequeo!
    try {
      return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* (Header, igual que antes) */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Mis Recetas y Pedidos</h2>
        <p className="text-emerald-50">Gestiona tus recetas médicas y revisa tus compras</p>
      </div>

      {/* (Tabs, igual que antes) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-auto p-1 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <TabsTrigger 
            value="prescriptions" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <FileText className="h-4 w-4" />
            <span>Mis Recetas Médicas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="orders"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <Package className="h-4 w-4" />
            <span>Mis Pedidos</span>
          </TabsTrigger>
        </TabsList>

        {/* --- ¡¡¡CAMBIO!!! ¡Le volví a poner el código de Recetas! --- */}
        <TabsContent value="prescriptions">
           <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
              <CardTitle className="text-emerald-900">Recetas Médicas Cargadas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tienes recetas cargadas</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-emerald-900">ID</TableHead>
                      <TableHead className="text-emerald-900">Medicamento</TableHead>
                      <TableHead className="text-emerald-900">Médico</TableHead>
                      <TableHead className="text-emerald-900">Fecha</TableHead>
                      <TableHead className="text-emerald-900">Estado</TableHead>
                      <TableHead className="text-right text-emerald-900">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((prescription) => (
                      <TableRow key={prescription.id} className="hover:bg-emerald-50/50">
                        <TableCell className="font-medium">{prescription.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="font-medium">{prescription.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{prescription.doctor}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>{getStatusBadge(prescription.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-emerald-100 text-emerald-700"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-teal-100 text-teal-700"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Descargar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- (Tab de Pedidos, "bobo", igual que antes) --- */}
        <TabsContent value="orders">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
              <CardTitle className="text-emerald-900">Historial de Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tienes pedidos realizados en esta sesión</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-emerald-900">ID Pedido</TableHead>
                      <TableHead className="text-emerald-900">Fecha</TableHead>
                      <TableHead className="text-emerald-900">Productos</TableHead>
                      <TableHead className="text-emerald-900">Total</TableHead>
                      <TableHead className="text-emerald-900">Estado</TableHead>
                      <TableHead className="text-right text-emerald-900">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id_pedido} className="hover:bg-emerald-50/50">
                        <TableCell className="font-semibold text-emerald-700">#{order.id_pedido}</TableCell>
                        <TableCell>{formatDate(order.fecha_pedido)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <span>
                              {order.detalles?.length || 0} producto{order.detalles?.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-700">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>{getOrderStatusBadge(order.estado)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="hover:bg-emerald-100 text-emerald-700"
                                onClick={() => setSelectedOrder(order)} 
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver Detalles
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* (Pop-up de "Ver Detalles", arreglado) */}
      <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido #{selectedOrder?.id_pedido}</DialogTitle>
            <DialogDescription>
              Fecha: {formatDate(selectedOrder?.fecha_pedido)}
              <br/>
              Estado: {getOrderStatusBadge(selectedOrder?.estado)}
              <br/>
              Pago: <span className="capitalize">{selectedOrder?.metodo_pago}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <h4 className="font-semibold text-gray-800">Productos Incluidos</h4>
            <div className="space-y-3">
              {selectedOrder?.detalles?.map((detalle, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-semibold text-gray-900">{detalle.medicamento.nombre_comercial}</p>
                    <p className="text-sm text-gray-500">Cantidad: {detalle.cantidad}</p>

                  </div>
                  <p className="font-medium text-gray-700">${(detalle.cantidad * detalle.precio_unitario).toFixed(2)}</p>
                </div>
              ))}
              
              {!selectedOrder?.detalles && (
                <p className="text-sm text-gray-500">No se pudieron cargar los detalles de los productos.</p>
              )}
            </div>
            
            <hr />
            
            <div className="space-y-2">
               <div className="flex justify-between text-gray-700">
                  <span>Subtotal (Neto):</span>
                  <span className="font-medium">${((selectedOrder?.total || 0) / 1.21).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>IVA (21%):</span>
                  <span className="font-medium">${((selectedOrder?.total || 0) - ((selectedOrder?.total || 0) / 1.21)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-xl text-emerald-900">
                  <span>Total (IVA Incluido):</span>
                  <span>${(selectedOrder?.total || 0).toFixed(2)}</span>
                </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}