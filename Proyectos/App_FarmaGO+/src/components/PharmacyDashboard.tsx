import { FileText, Clock, CheckCircle, AlertCircle, Star, TrendingUp, ChevronRight, Package } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface PharmacyDashboardProps {
  onNavigate?: (section: string) => void;
}

export function PharmacyDashboard({ onNavigate }: PharmacyDashboardProps) {
  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Dashboard Empleado - Farmacia</h2>
        <p className="text-emerald-50">Gestiona las recetas y pedidos de la farmacia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Recetas Pendientes */}
        <Card 
          className="border-2 border-yellow-200 hover:border-yellow-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('uploaded-recipes')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <Badge className="bg-yellow-500 text-white border-0">Nuevas</Badge>
            </div>
            <h3 className="font-semibold text-yellow-900 mb-1">Recetas Pendientes</h3>
            <p className="text-2xl font-bold text-yellow-600 mb-2">8</p>
            <div className="flex items-center text-sm text-yellow-600 font-medium">
              <span>Ver recetas</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: En Proceso */}
        <Card 
          className="border-2 border-emerald-200 hover:border-emerald-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('uploaded-recipes')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-md">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">Activo</Badge>
            </div>
            <h3 className="font-semibold text-emerald-900 mb-1">En Preparación</h3>
            <p className="text-2xl font-bold text-emerald-600 mb-2">5</p>
            <div className="flex items-center text-sm text-emerald-600 font-medium">
              <span>Ver detalles</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Completadas Hoy */}
        <Card 
          className="border-2 border-teal-200 hover:border-teal-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('uploaded-recipes')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle className="h-6 w-6 text-teal-600" />
              </div>
              <Badge variant="outline" className="text-teal-600 border-teal-500 bg-teal-50 font-medium">
                Hoy
              </Badge>
            </div>
            <h3 className="font-semibold text-teal-900 mb-1">Completadas</h3>
            <p className="text-2xl font-bold text-teal-600 mb-2">24</p>
            <div className="flex items-center text-sm text-teal-600 font-medium">
              <span>Ver historial</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Calificación de la Farmacia */}
        <Card 
          className="border-2 border-yellow-200 hover:border-yellow-400 transition-all cursor-pointer hover:shadow-xl hover:scale-105 bg-white"
          onClick={() => handleNavigate('pharmacy-ratings')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center relative shadow-md">
                <Star className="h-6 w-6 text-yellow-600 fill-yellow-600" />
              </div>
              <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                <Star className="h-3 w-3 text-yellow-600 fill-yellow-600" />
                <span className="text-xs text-yellow-700 font-medium">4.7</span>
              </div>
            </div>
            <h3 className="font-semibold text-yellow-900 mb-1">Calificación</h3>
            <p className="text-sm text-gray-600 mb-2">
              328 valoraciones positivas
            </p>
            <div className="flex items-center text-sm text-yellow-600 font-medium">
              <span>Ver detalles</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <Card className="border-2 border-emerald-100 shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-semibold text-emerald-900 mb-4 text-lg">Resumen de Actividad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-semibold text-emerald-900">37</p>
              <p className="text-sm text-emerald-700">Recetas procesadas hoy</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-semibold text-teal-900">+15%</p>
              <p className="text-sm text-teal-700">vs. semana anterior</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-semibold text-cyan-900">18 min</p>
              <p className="text-sm text-cyan-700">Tiempo promedio de prep.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-emerald-100">
          <CardContent className="p-4">
            <h4 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-emerald-600" />
              Alertas Importantes
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm text-gray-700">Stock bajo: Ibuprofeno 400mg</span>
                <Badge className="bg-red-500">Urgente</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-sm text-gray-700">Receta requiere verificación</span>
                <Badge className="bg-yellow-500">Pendiente</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-sm text-gray-700">Pedido especial para hoy</span>
                <Badge className="bg-orange-500">Hoy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-teal-100">
          <CardContent className="p-4">
            <h4 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-teal-600" />
              Desempeño del día
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Recetas procesadas</span>
                  <span className="font-semibold text-teal-600">37/40</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Satisfacción del cliente</span>
                  <span className="font-semibold text-emerald-600">96%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
