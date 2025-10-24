import { MapPin, Sparkles, Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function MapScreen() {
  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      <div className="max-w-4xl mx-auto">
        {/* Coming Soon Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-6 relative">
            <MapPin className="h-12 w-12 text-emerald-600" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-teal-500 animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Mapa de Farmacias
          </h2>
          
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg px-6 py-2 mb-6">
            Próximamente
          </Badge>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Estamos trabajando en una experiencia revolucionaria para que puedas encontrar farmacias cercanas y rastrear tus pedidos en tiempo real.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-emerald-200 bg-white shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-2">Geolocalización Inteligente</h3>
                  <p className="text-sm text-gray-600">
                    Encuentra las farmacias más cercanas a tu ubicación con un solo clic. Visualiza distancias, horarios y disponibilidad en tiempo real.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-teal-200 bg-white shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-2">Rastreo en Tiempo Real</h3>
                  <p className="text-sm text-gray-600">
                    Sigue tu pedido desde que sale de la farmacia hasta que llega a tu puerta. Conoce el tiempo estimado de llegada en todo momento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-200 bg-white shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-900 mb-2">Rutas Optimizadas</h3>
                  <p className="text-sm text-gray-600">
                    Nuestro sistema calculará la ruta más eficiente para que tu pedido llegue lo más rápido posible, ahorrando tiempo y costos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 bg-white shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-2">Información Detallada</h3>
                  <p className="text-sm text-gray-600">
                    Accede a información completa de cada farmacia: horarios, servicios disponibles, calificaciones de usuarios y más.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Banner */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-emerald-900 mb-3">
              ¡Mantente Atento!
            </h3>
            <p className="text-gray-700 max-w-xl mx-auto">
              Esta funcionalidad estará disponible muy pronto. Mientras tanto, puedes usar nuestras otras herramientas para gestionar tus recetas y chatear con farmacias.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
