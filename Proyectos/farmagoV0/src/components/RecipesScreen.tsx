import { useState } from "react";
import { FileText, Package, Eye, Download, CheckCircle, Clock, XCircle, MapPin, CreditCard } from "lucide-react";
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

interface Prescription {
  id: string;
  name: string;
  doctor: string;
  date: string;
  status: "Aprobado" | "Pendiente" | "Rechazado";
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "En Proceso" | "Enviado" | "Entregado" | "Cancelado";
  items: number;
}

export function RecipesScreen() {
  const [activeTab, setActiveTab] = useState("prescriptions");

  const prescriptions: Prescription[] = [
    {
      id: "RX-1001",
      name: "Ibuprofeno 600mg",
      doctor: "Dr. Juan García",
      date: "10/11/2024",
      status: "Aprobado"
    },
    {
      id: "RX-1002",
      name: "Amoxicilina 500mg",
      doctor: "Dra. María Fernández",
      date: "08/11/2024",
      status: "Pendiente"
    },
    {
      id: "RX-1003",
      name: "Atorvastatina 20mg",
      doctor: "Dr. Carlos Rodríguez",
      date: "05/11/2024",
      status: "Aprobado"
    },
    {
      id: "RX-1004",
      name: "Omeprazol 40mg",
      doctor: "Dr. Juan García",
      date: "01/11/2024",
      status: "Rechazado"
    }
  ];

  const orders: Order[] = [
    {
      id: "#P-1005",
      date: "12/11/2024",
      total: 2850.00,
      status: "Enviado",
      items: 3
    },
    {
      id: "#P-1004",
      date: "08/11/2024",
      total: 1450.00,
      status: "Entregado",
      items: 2
    },
    {
      id: "#P-1003",
      date: "05/11/2024",
      total: 3200.00,
      status: "En Proceso",
      items: 5
    },
    {
      id: "#P-1002",
      date: "02/11/2024",
      total: 890.00,
      status: "Entregado",
      items: 1
    }
  ];

  const getStatusBadge = (status: Prescription["status"]) => {
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

  const getOrderStatusBadge = (status: Order["status"]) => {
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
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Mis Recetas y Pedidos</h2>
        <p className="text-emerald-50">Gestiona tus recetas médicas y revisa tus compras</p>
      </div>

      {/* Tabs */}
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

        {/* Prescriptions Tab */}
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

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
              <CardTitle className="text-emerald-900">Historial de Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tienes pedidos realizados</p>
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
                      <TableRow key={order.id} className="hover:bg-emerald-50/50">
                        <TableCell className="font-semibold text-emerald-700">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <span>{order.items} producto{order.items > 1 ? 's' : ''}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-700">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-emerald-100 text-emerald-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
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
    </div>
  );
}
