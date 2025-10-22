import { MessageSquare, Sparkles, Clock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function PharmacyChatScreen() {
  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      <div className="max-w-4xl mx-auto">
        {/* Coming Soon Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-6 relative">
            <MessageSquare className="h-12 w-12 text-emerald-600" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-teal-500 animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Chat con Farmacias
          </h2>
          
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg px-6 py-2 mb-6">
            Próximamente
          </Badge>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Estamos desarrollando una plataforma de chat en tiempo real para que puedas consultar con farmacéuticos profesionales al instante.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-emerald-200 bg-white shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-2">Chat en Tiempo Real</h3>
                  <p className="text-sm text-gray-600">
                    Comunícate instantáneamente con farmacéuticos certificados para resolver tus dudas sobre medicamentos, dosis y tratamientos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-teal-200 bg-white shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-teal-900 mb-2">Consultas Confidenciales</h3>
                  <p className="text-sm text-gray-600">
                    Todas tus conversaciones estarán encriptadas y protegidas. Tu privacidad y la confidencialidad médica son nuestra prioridad.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-200 bg-white shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-cyan-900 mb-2">Disponibilidad 24/7</h3>
                  <p className="text-sm text-gray-600">
                    Accede a asistencia farmacéutica cualquier día a cualquier hora. Siempre habrá un profesional disponible para ayudarte.
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-2">Historial de Conversaciones</h3>
                  <p className="text-sm text-gray-600">
                    Revisa todas tus consultas anteriores cuando lo necesites. Mantén un registro completo de tus interacciones y recomendaciones.
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
              ¡Muy Pronto Disponible!
            </h3>
            <p className="text-gray-700 max-w-xl mx-auto">
              Estamos trabajando arduamente para brindarte la mejor experiencia de consulta farmacéutica. Mientras tanto, puedes gestionar tus recetas y explorar otras funcionalidades.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
