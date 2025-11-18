import { CheckCircle, Package, MapPin, Calendar, Home, Heart } from "lucide-react"; // <--- ¡CAMBIO! (Agregué 'Heart')
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface OrderConfirmationScreenProps {
  orderId: string;
  onGoToHome: () => void;
  onGoToOrders: () => void;
}

export function OrderConfirmationScreen({ 
  orderId, 
  onGoToHome, 
  onGoToOrders 
}: OrderConfirmationScreenProps) {
  // (La fecha estimada, igual que antes)
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 3);
  const formattedDate = estimatedDate.toLocaleDateString('es-AR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="flex-1 p-6 flex items-center justify-center bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      <div className="max-w-2xl w-full">
        <Card className="border-2 border-emerald-200 shadow-2xl">
          <CardContent className="p-12 text-center">
            {/* (Icono de Check, igual que antes) */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full animate-pulse"></div>
              <div className="absolute inset-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="h-16 w-16 text-white" strokeWidth={3} />
              </div>
            </div>

            {/* (Título, igual que antes) */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              ¡Pedido Confirmado!
            </h1>

            {/* (ID del Pedido, igual que antes) */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full border-2 border-emerald-200 mb-6">
              <Package className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-emerald-900">
                Pedido: <span className="text-emerald-600">#{orderId}</span>
              </span>
            </div>

            {/* (Mensaje de Éxito, igual que antes) */}
            <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
              Tu pedido ha sido procesado exitosamente. Hemos enviado un correo de confirmación 
              con los detalles de tu compra.
            </p>

            {/* (Info Cards, igual que antes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                <div className="flex items-center gap-3 justify-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-emerald-900">Entrega Estimada</h3>
                </div>
                <p className="text-sm text-emerald-800">{formattedDate}</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                <div className="flex items-center gap-3 justify-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-emerald-900">Seguimiento</h3>
                </div>
                <p className="text-sm text-emerald-800">
                  Disponible en 'Mis Pedidos'
                </p>
              </div>
            </div>

            {/* --- ¡¡¡CAMBIO!!! ¡Volamos el "Qué sigue?"! --- */}
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 mb-8">
              <h4 className="font-semibold text-2xl text-emerald-900 flex items-center justify-center gap-2">
                <Heart className="h-6 w-6 text-emerald-600" />
                ¡Muchas gracias por tu compra!
              </h4>
            </div>
            {/* --- FIN DEL CAMBIO --- */}


            {/* (Botones de Acción, igual que antes) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onGoToOrders}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
                size="lg"
              >
                <Package className="h-5 w-5 mr-2" />
                Ver Mis Pedidos
              </Button>
              <Button
                onClick={onGoToHome}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                size="lg"
              >
                <Home className="h-5 w-5 mr-2" />
                Volver al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}