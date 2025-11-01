import { Upload, MapPin, Store, MessageSquare, Package, ChevronRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface DashboardScreenProps {
  onNavigate?: (section: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Dashboard FarmaGo+</h2>
        <p className="text-emerald-50">Accesos rápidos a las funciones principales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Subir / Escanear receta */}
        <Card 
          className="border-2 border-emerald-200 hover:border-emerald-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('upload-recipe')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-md">
                <Upload className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">Nuevo</Badge>
            </div>
            <h3 className="font-semibold text-emerald-900 mb-1">Subir Receta</h3>
            <p className="text-sm text-gray-600 mb-3">
              Carga tu receta médica en PDF o foto
            </p>
            <div className="flex items-center text-sm text-emerald-600 font-medium">
              <span>Ir a cargar</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Rastrear pedido (mapa en vivo) */}
        <Card 
          className="border-2 border-teal-200 hover:border-teal-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('inventory')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-md">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <Badge className="bg-teal-100 text-teal-700 border-teal-300">En camino</Badge>
            </div>
            <h3 className="font-semibold text-teal-900 mb-1">Rastrear Pedido</h3>
            <p className="text-sm text-gray-600 mb-3">
              Ubicación en tiempo real - ETA: 12 min
            </p>
            <div className="flex items-center text-sm text-teal-600 font-medium">
              <span>Ver mapa</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Mi farmacia / Seleccionar farmacia */}
        <Card 
          className="border-2 border-cyan-200 hover:border-cyan-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('inventory')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center shadow-md">
                <Store className="h-6 w-6 text-cyan-600" />
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-500 bg-emerald-50 font-medium">
                24h
              </Badge>
            </div>
            <h3 className="font-semibold text-cyan-900 mb-1">Mi Farmacia</h3>
            <p className="text-sm text-gray-600 mb-3">
              Farmacia San José - 0.8 km
            </p>
            <div className="flex items-center text-sm text-cyan-600 font-medium">
              <span>Cambiar farmacia</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Chat card removed for clients */}
      </div>

      {/* Additional Quick Stats */}
      <Card className="border-2 border-emerald-100 shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-semibold text-emerald-900 mb-4 text-lg">Resumen de Actividad</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Package className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-semibold text-emerald-900">3</p>
              <p className="text-sm text-emerald-700">Recetas subidas</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Store className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-semibold text-teal-900">5</p>
              <p className="text-sm text-teal-700">Farmacias cercanas</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-semibold text-cyan-900">12</p>
              <p className="text-sm text-cyan-700">Consultas realizadas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
