import { useState } from "react";
import { MapPin, Navigation, Package, User, Phone, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

export function MapScreenPharmacy() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

  const pendingOrders = [
    {
      id: 1234,
      customerName: "J. Doe",
      address: "Calle 12 y 60, La Plata",
      distance: "2.3 km",
      total: "$3,200",
      items: 3,
      lat: -34.9234,
      lng: -57.9567,
    },
    {
      id: 1235,
      customerName: "M. González",
      address: "Av. 7 y 52, La Plata",
      distance: "1.8 km",
      total: "$4,500",
      items: 2,
      lat: -34.9198,
      lng: -57.9523,
    },
    {
      id: 1236,
      customerName: "C. Rodríguez",
      address: "Diagonal 74 y 10, La Plata",
      distance: "3.1 km",
      total: "$2,100",
      items: 1,
      lat: -34.9167,
      lng: -57.9489,
    },
  ];

  const availableDrivers = [
    {
      id: 1,
      name: "Carlos Pérez",
      status: "Libre",
      distance: "0.5 km",
      rating: 4.8,
      deliveries: 24,
      lat: -34.9203,
      lng: -57.9540,
    },
    {
      id: 2,
      name: "Ana Martínez",
      status: "Libre",
      distance: "1.2 km",
      rating: 4.9,
      deliveries: 32,
      lat: -34.9215,
      lng: -57.9555,
    },
    {
      id: 3,
      name: "Luis Fernández",
      status: "En entrega",
      distance: "2.1 km",
      rating: 4.7,
      deliveries: 18,
      lat: -34.9178,
      lng: -57.9501,
    },
  ];

  return (
    <div className="flex-1 flex">
      {/* Sidebar - Order List */}
      <div className="w-96 bg-white border-r-2 border-emerald-200 flex flex-col">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
          <h2 className="text-xl font-semibold mb-1">Pedidos Pendientes</h2>
          <p className="text-emerald-50 text-sm">de Asignación</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {pendingOrders.map((order) => (
              <Card
                key={order.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedOrder === order.id
                    ? "border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50"
                    : "border-2 border-emerald-100"
                }`}
                onClick={() => setSelectedOrder(order.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-emerald-900">
                            Pedido #{order.id}
                          </h4>
                          <p className="text-sm text-gray-600">Cliente: {order.customerName}</p>
                        </div>
                        <Badge className="bg-yellow-500">{order.items} items</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <MapPin className="h-3 w-3 text-emerald-600" />
                          <span className="text-xs">{order.address}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Navigation className="h-3 w-3 text-teal-600" />
                          <span className="text-xs">{order.distance}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center justify-between">
                        <span className="font-semibold text-emerald-700">{order.total}</span>
                        {selectedOrder === order.id && (
                          <Badge variant="outline" className="text-emerald-700 border-emerald-500">
                            Seleccionado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {selectedOrder && selectedDriver && (
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-t-2 border-emerald-200">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12">
              <CheckCircle className="h-5 w-5 mr-2" />
              Asignar Pedido #{selectedOrder} a {availableDrivers.find(d => d.id === selectedDriver)?.name}
            </Button>
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100">
          {/* Placeholder Map */}
          <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Mapa de La Plata, Buenos Aires</p>
              <p className="text-xs text-gray-500">Vista de Farmacia</p>
            </div>
          </div>

          {/* Pharmacy Location (Center - Fixed) */}
          <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl border-4 border-white shadow-2xl flex items-center justify-center">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <Badge className="bg-emerald-900 shadow-lg">Farmacia San José</Badge>
              </div>
            </div>
          </div>

          {/* Order Delivery Location Pins */}
          <div className="absolute" style={{ top: '35%', left: '60%' }}>
            <button
              onClick={() => setSelectedOrder(1234)}
              className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform ${
                selectedOrder === 1234
                  ? "bg-gradient-to-br from-yellow-500 to-orange-500 ring-4 ring-yellow-300"
                  : "bg-gradient-to-br from-red-500 to-pink-500"
              }`}
            >
              <MapPin className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="absolute" style={{ top: '55%', left: '55%' }}>
            <button
              onClick={() => setSelectedOrder(1235)}
              className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform ${
                selectedOrder === 1235
                  ? "bg-gradient-to-br from-yellow-500 to-orange-500 ring-4 ring-yellow-300"
                  : "bg-gradient-to-br from-red-500 to-pink-500"
              }`}
            >
              <MapPin className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="absolute" style={{ top: '40%', left: '40%' }}>
            <button
              onClick={() => setSelectedOrder(1236)}
              className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform ${
                selectedOrder === 1236
                  ? "bg-gradient-to-br from-yellow-500 to-orange-500 ring-4 ring-yellow-300"
                  : "bg-gradient-to-br from-red-500 to-pink-500"
              }`}
            >
              <MapPin className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Available Drivers */}
          <div className="absolute" style={{ top: '48%', left: '52%' }}>
            <button
              onClick={() => setSelectedDriver(1)}
              className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform ${
                selectedDriver === 1
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600 ring-4 ring-blue-300"
                  : "bg-gradient-to-br from-blue-500 to-cyan-500"
              }`}
            >
              <Navigation className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="absolute" style={{ top: '58%', left: '48%' }}>
            <button
              onClick={() => setSelectedDriver(2)}
              className={`w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform ${
                selectedDriver === 2
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600 ring-4 ring-blue-300"
                  : "bg-gradient-to-br from-blue-500 to-cyan-500"
              }`}
            >
              <Navigation className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="absolute" style={{ top: '42%', left: '45%' }}>
            <button
              onClick={() => setSelectedDriver(3)}
              className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center opacity-60"
            >
              <Navigation className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Driver Info Card */}
        {selectedDriver && (
          <div className="absolute bottom-6 right-6 z-10 w-96">
            <Card className="border-2 border-blue-300 shadow-2xl bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  Repartidor Seleccionado
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const driver = availableDrivers.find(d => d.id === selectedDriver);
                  if (!driver) return null;
                  
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{driver.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={driver.status === "Libre" ? "bg-emerald-500" : "bg-orange-500"}>
                              {driver.status}
                            </Badge>
                            <span className="text-sm text-gray-600">{driver.distance}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Calificación</p>
                          <p className="font-semibold text-blue-700">⭐ {driver.rating}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Entregas</p>
                          <p className="font-semibold text-blue-700">{driver.deliveries}</p>
                        </div>
                      </div>

                      {driver.status === "Libre" && selectedOrder && (
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Asignar Pedido
                        </Button>
                      )}

                      <Button 
                        variant="outline" 
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </Button>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-6 left-6 z-10">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full" />
                <span className="text-xs font-medium">Mi Farmacia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full" />
                <span className="text-xs font-medium">Pedidos Pendientes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full" />
                <span className="text-xs font-medium">Repartidores Libres</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full opacity-60" />
                <span className="text-xs font-medium">En Entrega</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
