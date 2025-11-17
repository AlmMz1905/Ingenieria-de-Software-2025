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

  // --- ¡CAMBIO! Volvimos a meter el 'loading' y 'useEffect' ---
  // (¡Pero solo si 'orders' está vacío!)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- (La maqueta de 'prescriptions' sigue igual) ---
  const prescriptions: Prescription[] = [
    {
      id: "RX-1001",
      name: "Ibuprofeno 600mg",
      doctor: "Dr. Juan García",
      date: "10/11/2024",
      status: "Aprobado"
    },
    // ...
  ];

  // --- (Lógica de 'useEffect' para buscar pedidos) ---
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem("authToken");
        if (!apiUrl || !token) {
          throw new Error("No estás autenticado o la API no está configurada.");
        }

        const response = await fetch(`${apiUrl}/orders/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "Error al cargar los pedidos.");
        }
        
        const data: Order[] = await response.json();
        setOrders(data); // ¡Guardamos en el estado "Padre"!
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    // ¡Solo buscamos si el estado Padre está vacío!
    if (orders.length === 0) {
      fetchOrders();
    } else {
      setLoading(false); // Ya los teníamos
    }
  }, [orders.length, setOrders]); 
  // --- FIN DE LA NUEVA LÓGICA ---


  const getStatusBadge = (status: Prescription["status"]) => {
    // ... (igual que antes)
  };

  const getOrderStatusBadge = (status: string) => {
    // ... (igual que antes)
  };
  
  const formatDate = (dateString: string) => {
    // ... (igual que antes)
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
        <TabsList className="grid w-full grid-cols-2 mb-6 ...">
          {/* ... (TabsTrigger igual) ... */}
        </TabsList>

        {/* (Prescriptions Tab, igual que antes, ¡sigue siendo maqueta!) */}
        <TabsContent value="prescriptions">
           <Card className="border-2 border-emerald-100 shadow-lg">
            {/* ... (Toda la maqueta de recetas) ... */}
           </Card>
        </TabsContent>

        {/* (Tab de Pedidos, "enchufada") */}
        <TabsContent value="orders">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
              <CardTitle className="text-emerald-900">Historial de Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* ¡Manejo de Carga y Error! */}
              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-gray-300 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-500">Buscando tu historial de pedidos...</p>
                </div>
              )}
              {error && (
                <div className="text-center py-12 text-red-700">
                  <Info className="h-12 w-12 text-red-300 mx-auto mb-3" />
                  <p className="font-semibold">¡Ups! Algo salió mal</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {!loading && !error && orders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tienes pedidos realizados</p>
                </div>
              )}
              
              {!loading && !error && orders.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Pedido</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
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

      {/* --- ¡¡¡CAMBIO TOTAL!!! ¡El pop-up "Ver Detalles" arreglado! --- */}
      <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido #{selectedOrder?.id_pedido}</DialogTitle>
            {/* ¡Agregamos el Método de Pago! */}
            <DialogDescription>
              Fecha: {formatDate(selectedOrder?.fecha_pedido || "")}
              <br/>
              Estado: {getOrderStatusBadge(selectedOrder?.estado || "")}
              <br/>
              Pago: <span className="capitalize">{selectedOrder?.metodo_pago}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <h4 className="font-semibold text-gray-800">Productos Incluidos</h4>
            <div className="space-y-3">
              {/* ¡Ahora sí va a encontrar los 'detalles' que "grapamos"! */}
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
            
            {/* ¡Ahora el cálculo del IVA es el que VOS pediste! */}
            <div className="space-y-2">
               <div className="flex justify-between text-gray-700">
                  <span>Subtotal (Neto):</span>
                  {/* ¡Calculamos el Neto (Total / 1.21)! */}
                  <span className="font-medium">${((selectedOrder?.total || 0) / 1.21).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>IVA (21%):</span>
                  {/* ¡Calculamos el IVA (Total - Neto)! */}
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