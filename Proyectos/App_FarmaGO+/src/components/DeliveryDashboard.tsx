import { Package, MapPin, Clock, Star, TrendingUp, DollarSign, ChevronRight, Navigation } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface DeliveryDashboardProps {
  onNavigate?: (section: string) => void;
}

export function DeliveryDashboard({ onNavigate }: DeliveryDashboardProps) {
  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Dashboard Repartidor</h2>
        <p className="text-emerald-50">Gestiona tus entregas y ganancias del día</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pedidos Pendientes */}
        <Card 
          className="border-2 border-yellow-200 hover:border-yellow-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('delivery-orders')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <Badge className="bg-yellow-500 text-white border-0">Nuevos</Badge>
            </div>
            <h3 className="font-semibold text-yellow-900 mb-1">Pedidos Pendientes</h3>
            <p className="text-2xl font-bold text-yellow-600 mb-2">2</p>
            <div className="flex items-center text-sm text-yellow-600 font-medium">
              <span>Ver pedidos</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: En Camino */}
        <Card 
          className="border-2 border-emerald-200 hover:border-emerald-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('inventory')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-md">
                <Navigation className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">Activo</Badge>
            </div>
            <h3 className="font-semibold text-emerald-900 mb-1">En Camino</h3>
            <p className="text-sm text-gray-600 mb-2">
              Pedido #PED-002 - ETA: 8 min
            </p>
            <div className="flex items-center text-sm text-emerald-600 font-medium">
              <span>Ver mapa</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Entregas del Día */}
        <Card 
          className="border-2 border-teal-200 hover:border-teal-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('delivery-orders')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-md">
                <Package className="h-6 w-6 text-teal-600" />
              </div>
              <Badge variant="outline" className="text-teal-600 border-teal-500 bg-teal-50 font-medium">
                Hoy
              </Badge>
            </div>
            <h3 className="font-semibold text-teal-900 mb-1">Entregas Realizadas</h3>
            <p className="text-2xl font-bold text-teal-600 mb-2">8</p>
            <div className="flex items-center text-sm text-teal-600 font-medium">
              <span>Ver historial</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Calificaciones */}
        <Card 
          className="border-2 border-yellow-200 hover:border-yellow-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('ratings')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center relative shadow-md">
                <Star className="h-6 w-6 text-yellow-600 fill-yellow-600" />
              </div>
              <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                <Star className="h-3 w-3 text-yellow-600 fill-yellow-600" />
                <span className="text-xs text-yellow-700 font-medium">4.8</span>
              </div>
            </div>
            <h3 className="font-semibold text-yellow-900 mb-1">Mis Calificaciones</h3>
            <p className="text-sm text-gray-600 mb-2">
              156 valoraciones positivas
            </p>
            <div className="flex items-center text-sm text-yellow-600 font-medium">
              <span>Ver detalles</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings and Stats */}
      <Card className="border-2 border-emerald-100 shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-semibold text-emerald-900 mb-4 text-lg">Resumen de Ganancias</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-semibold text-emerald-900">$3,200</p>
              <p className="text-sm text-emerald-700">Ganancia de hoy</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-semibold text-teal-900">$18,500</p>
              <p className="text-sm text-teal-700">Esta semana</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Package className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-semibold text-cyan-900">45</p>
              <p className="text-sm text-cyan-700">Entregas este mes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-emerald-100">
          <CardContent className="p-4">
            <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Zonas más activas
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg">
                <span className="text-sm text-gray-700">Palermo</span>
                <Badge className="bg-emerald-500">15 entregas</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-teal-50 rounded-lg">
                <span className="text-sm text-gray-700">Recoleta</span>
                <Badge className="bg-teal-500">12 entregas</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-cyan-50 rounded-lg">
                <span className="text-sm text-gray-700">Belgrano</span>
                <Badge className="bg-cyan-500">8 entregas</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-teal-100">
          <CardContent className="p-4">
            <h4 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              Tiempos de entrega
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Promedio de entrega</span>
                  <span className="font-semibold text-teal-600">12 min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Entregas a tiempo</span>
                  <span className="font-semibold text-emerald-600">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
