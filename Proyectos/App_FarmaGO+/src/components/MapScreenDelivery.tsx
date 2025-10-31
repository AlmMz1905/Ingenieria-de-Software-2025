import { useState } from "react";
import { MapPin, Navigation, Package, Phone, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export function MapScreenDelivery() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [hasActiveDelivery, setHasActiveDelivery] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState<"goToPharmacy" | "goToCustomer">("goToPharmacy");

  const handleAcceptOrder = () => {
    setShowNewOrderModal(false);
    setHasActiveDelivery(true);
    setDeliveryStep("goToPharmacy");
  };

  const handlePickedUp = () => {
    setDeliveryStep("goToCustomer");
  };

  const handleDelivered = () => {
    setHasActiveDelivery(false);
  };

  return (
    <div className="flex-1 relative">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100">
        {/* Placeholder Map */}
        <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="h-16 w-16 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Mapa de La Plata, Buenos Aires</p>
            <p className="text-xs text-gray-500">Vista de Repartidor</p>
          </div>
        </div>

        {/* Driver Location (Center) */}
        <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center">
              <Navigation className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30" />
          </div>
        </div>

        {hasActiveDelivery && (
          <>
            {/* Pharmacy Location */}
            <div className="absolute" style={{ top: '35%', left: '40%' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Customer Location */}
            <div className="absolute" style={{ top: '65%', left: '58%' }}>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>

            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="routeGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              {deliveryStep === "goToPharmacy" ? (
                <path
                  d="M 50% 50% L 40% 35%"
                  stroke="url(#routeGradient2)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="10 5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <path
                    d="M 40% 35% Q 45% 42%, 50% 50%"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  <path
                    d="M 50% 50% Q 53% 57%, 58% 65%"
                    stroke="url(#routeGradient2)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="10 5"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </>
        )}
      </div>

      {/* Status Toggle */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
        <Card className="border-2 border-emerald-200 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Estado:</span>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${isOnline ? "text-emerald-700" : "text-gray-500"}`}>
                  {isOnline ? "Online" : "Offline"}
                </span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
                />
              </div>
              {isOnline && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse">
                  Disponible para pedidos
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Order Modal */}
      <Dialog open={showNewOrderModal} onOpenChange={setShowNewOrderModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-emerald-900 text-2xl flex items-center gap-2">
              <Package className="h-6 w-6 text-emerald-600" />
              Nuevo Pedido
            </DialogTitle>
            <DialogDescription>
              Revisa los detalles del pedido y decide si aceptar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Pickup Location */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Retirar en:</p>
                  <p className="font-semibold text-emerald-900">Farmacia San José</p>
                  <p className="text-sm text-gray-700">Calle 8 y 44, La Plata</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-emerald-700 border-emerald-500">
                      1.2 km de tu ubicación
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Entregar en:</p>
                  <p className="font-semibold text-red-900">Cliente J. Doe</p>
                  <p className="text-sm text-gray-700">Calle 12 y 60, La Plata</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-red-700 border-red-500">
                      2.8 km desde farmacia
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div>
                <p className="text-sm text-gray-600">Pago estimado por este viaje</p>
                <p className="text-2xl font-bold text-blue-700">$850</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Distancia total</p>
                <p className="text-lg font-semibold text-gray-900">4.0 km</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowNewOrderModal(false)}
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50 h-12"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Rechazar
            </Button>
            <Button
              onClick={handleAcceptOrder}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Aceptar Viaje
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Button to Show Modal */}
      {!hasActiveDelivery && isOnline && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
          <Button
            onClick={() => setShowNewOrderModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-2xl animate-pulse"
          >
            🔔 Simular Nuevo Pedido
          </Button>
        </div>
      )}

      {/* Active Delivery Card */}
      {hasActiveDelivery && (
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <Card className="border-2 border-blue-300 shadow-2xl bg-white">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Current Step */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    {deliveryStep === "goToPharmacy" ? (
                      <MapPin className="h-7 w-7 text-white" />
                    ) : (
                      <Package className="h-7 w-7 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-blue-500 mb-2">
                      {deliveryStep === "goToPharmacy" ? "Paso 1 de 2" : "Paso 2 de 2"}
                    </Badge>
                    <h3 className="font-semibold text-gray-900">
                      {deliveryStep === "goToPharmacy"
                        ? "Dirígete a la farmacia"
                        : "Entrega el pedido al cliente"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {deliveryStep === "goToPharmacy"
                        ? "Farmacia San José - Calle 8 y 44"
                        : "Cliente J. Doe - Calle 12 y 60"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Navegar
                  </Button>
                  <Button
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>

                {/* Status Buttons */}
                <div className="pt-2 border-t">
                  {deliveryStep === "goToPharmacy" ? (
                    <Button
                      onClick={handlePickedUp}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Llegué (Retiré Pedido)
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDelivered}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Pedido Entregado
                    </Button>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    {deliveryStep === "goToPharmacy" ? "Farmacia" : "Cliente"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info when Offline */}
      {!isOnline && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <Card className="border-2 border-gray-300 shadow-xl bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Navigation className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Estás Offline</h3>
              <p className="text-sm text-gray-600 mb-4">
                Activa el modo Online para recibir pedidos
              </p>
              <Button
                onClick={() => setIsOnline(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Activar Modo Online
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
