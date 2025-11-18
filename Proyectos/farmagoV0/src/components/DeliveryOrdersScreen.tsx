import { Package, MapPin, Clock, Phone, CheckCircle, Navigation, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function DeliveryOrdersScreen() {
  const orders = [
    {
      id: "PED-001",
      customerName: "María González",
      address: "Av. Corrientes 1234, CABA",
      phone: "+54 11 2345-6789",
      items: 3,
      total: "$4,500",
      status: "pending",
      distance: "2.3 km",
      estimatedTime: "15 min",
      pharmacy: "Farmacia San José",
    },
    {
      id: "PED-002",
      customerName: "Carlos Rodríguez",
      address: "Calle Florida 567, CABA",
      phone: "+54 11 3456-7890",
      items: 2,
      total: "$2,800",
      status: "in-transit",
      distance: "0.8 km",
      estimatedTime: "8 min",
      pharmacy: "Farmacia del Centro",
    },
    {
      id: "PED-003",
      customerName: "Ana Martínez",
      address: "Av. Santa Fe 2890, CABA",
      phone: "+54 11 4567-8901",
      items: 5,
      total: "$6,200",
      status: "pending",
      distance: "3.5 km",
      estimatedTime: "20 min",
      pharmacy: "Farmacia La Salud",
    },
    {
      id: "PED-004",
      customerName: "Juan Pérez",
      address: "Av. Rivadavia 1500, CABA",
      phone: "+54 11 5678-9012",
      items: 1,
      total: "$1,200",
      status: "delivered",
      distance: "1.2 km",
      estimatedTime: "Entregado",
      pharmacy: "Farmacia Central",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendiente</Badge>;
      case "in-transit":
        return <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500">En Camino</Badge>;
      case "delivered":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Entregado</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Pedidos para Entregar</h2>
        <p className="text-emerald-50">Gestiona tus entregas activas y pendientes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-yellow-600">2</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Camino</p>
                <p className="text-2xl font-semibold text-emerald-600">1</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Navigation className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entregados Hoy</p>
                <p className="text-2xl font-semibold text-gray-600">8</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-teal-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ganancia Hoy</p>
                <p className="text-2xl font-semibold text-teal-600">$3,200</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-emerald-900">Lista de Pedidos</h3>
        
        {orders.map((order) => (
          <Card key={order.id} className="border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{order.customerName}</CardTitle>
                    <p className="text-sm text-gray-600">{order.id}</p>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.address}</p>
                    <p className="text-xs text-gray-600">{order.distance} de distancia</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tiempo estimado</p>
                    <p className="text-xs text-gray-600">{order.estimatedTime}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {order.items} artículos
                  </span>
                  <span className="font-semibold text-emerald-700">{order.total}</span>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                    {order.pharmacy}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {order.status === "pending" && (
                  <>
                    <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      <Navigation className="h-4 w-4 mr-2" />
                      Aceptar Pedido
                    </Button>
                    <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar
                    </Button>
                  </>
                )}
                {order.status === "in-transit" && (
                  <>
                    <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Entregado
                    </Button>
                    <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                      <MapPin className="h-4 w-4 mr-2" />
                      Ver Mapa
                    </Button>
                    <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar
                    </Button>
                  </>
                )}
                {order.status === "delivered" && (
                  <Badge variant="outline" className="text-gray-600 border-gray-300 px-4 py-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Pedido completado
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
