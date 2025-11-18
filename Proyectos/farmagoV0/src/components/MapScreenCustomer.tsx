import { useState } from "react";
import { Search, MapPin, Clock, Navigation, Phone, Star, Filter } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Toggle } from "./ui/toggle";

interface MapScreenCustomerProps {
  trackingMode?: boolean;
}

export function MapScreenCustomer({ trackingMode = false }: MapScreenCustomerProps) {
  const [selectedPharmacy, setSelectedPharmacy] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    onDuty: false,
    openNow: true,
    allDay: false,
  });

  const pharmacies = [
    {
      id: 1,
      name: "Farmacia San José",
      address: "Calle 8 y 44, La Plata",
      distance: "0.8 km",
      rating: 4.7,
      onDuty: true,
      open: true,
      hours: "24hs",
      lat: -34.9205,
      lng: -57.9536,
    },
    {
      id: 2,
      name: "Farmacia del Centro",
      address: "Av. 7 entre 47 y 48, La Plata",
      distance: "1.2 km",
      rating: 4.5,
      onDuty: false,
      open: true,
      hours: "8:00 - 22:00",
      lat: -34.9214,
      lng: -57.9544,
    },
    {
      id: 3,
      name: "Farmacia La Plata",
      address: "Diagonal 74 y 5, La Plata",
      distance: "1.5 km",
      rating: 4.8,
      onDuty: true,
      open: true,
      hours: "24hs",
      lat: -34.9187,
      lng: -57.9512,
    },
  ];

  if (trackingMode) {
    return (
      <div className="flex-1 relative">
        {/* Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100">
          {/* Placeholder Map */}
          <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Mapa de La Plata</p>
              <p className="text-xs text-gray-500">Tracking en tiempo real</p>
            </div>
          </div>

          {/* User Location Pin (Blue) */}
          <div className="absolute" style={{ top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
          </div>

          {/* Pharmacy Location Pin (Green) */}
          <div className="absolute" style={{ top: '35%', left: '40%', transform: 'translate(-50%, -50%)' }}>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Delivery Driver Icon (Moving) */}
          <div className="absolute" style={{ top: '48%', left: '45%', transform: 'translate(-50%, -50%)' }}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse">
              <Navigation className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Route Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <path
              d="M 40% 35% Q 42% 40%, 45% 48% T 50% 60%"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10 5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Tracking Card */}
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <Card className="border-2 border-emerald-300 shadow-2xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Navigation className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-emerald-900">Tu pedido está en camino</h3>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500">En tránsito</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Repartidor: Carlos Rodríguez</p>
                  <p className="text-sm text-gray-600 mb-3">Desde: Farmacia San José</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <span className="text-lg font-semibold text-emerald-700">ETA: 12 minutos</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar al Repartidor
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100">
        {/* Placeholder Map */}
        <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Mapa de La Plata, Buenos Aires</p>
          </div>
        </div>

        {/* User Location Pin (Blue) */}
        <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
          </div>
        </div>

        {/* Pharmacy Pins */}
        <div className="absolute" style={{ top: '40%', left: '45%' }}>
          <button
            onClick={() => setSelectedPharmacy(1)}
            className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MapPin className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="absolute" style={{ top: '55%', left: '48%' }}>
          <button
            onClick={() => setSelectedPharmacy(2)}
            className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MapPin className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="absolute" style={{ top: '35%', left: '52%' }}>
          <button
            onClick={() => setSelectedPharmacy(3)}
            className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MapPin className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <div className="absolute top-6 left-6 right-6 z-10 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600" />
          <Input
            placeholder="Buscar farmacias en La Plata..."
            className="pl-12 pr-4 h-14 bg-white border-2 border-emerald-200 shadow-lg text-base focus:ring-emerald-500 rounded-2xl"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Toggle
            pressed={filters.onDuty}
            onPressedChange={(pressed) => setFilters({ ...filters, onDuty: pressed })}
            className="bg-white border-2 border-emerald-200 shadow-md data-[state=on]:bg-gradient-to-r data-[state=on]:from-emerald-500 data-[state=on]:to-teal-500 data-[state=on]:text-white rounded-xl"
          >
            <Clock className="h-4 w-4 mr-2" />
            Farmacias de Turno
          </Toggle>
          
          <Toggle
            pressed={filters.openNow}
            onPressedChange={(pressed) => setFilters({ ...filters, openNow: pressed })}
            className="bg-white border-2 border-emerald-200 shadow-md data-[state=on]:bg-gradient-to-r data-[state=on]:from-emerald-500 data-[state=on]:to-teal-500 data-[state=on]:text-white rounded-xl"
          >
            Abierta Ahora
          </Toggle>
          
          <Toggle
            pressed={filters.allDay}
            onPressedChange={(pressed) => setFilters({ ...filters, allDay: pressed })}
            className="bg-white border-2 border-emerald-200 shadow-md data-[state=on]:bg-gradient-to-r data-[state=on]:from-emerald-500 data-[state=on]:to-teal-500 data-[state=on]:text-white rounded-xl"
          >
            24hs
          </Toggle>
        </div>
      </div>

      {/* Pharmacy Info Card */}
      {selectedPharmacy && (
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <Card className="border-2 border-emerald-300 shadow-2xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-emerald-900">
                        {pharmacies[selectedPharmacy - 1].name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {pharmacies[selectedPharmacy - 1].address}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedPharmacy(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Navigation className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">
                        {pharmacies[selectedPharmacy - 1].distance}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {pharmacies[selectedPharmacy - 1].rating}
                      </span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                      {pharmacies[selectedPharmacy - 1].hours}
                    </Badge>
                    {pharmacies[selectedPharmacy - 1].onDuty && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500">
                        De Turno
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      Ver Farmacia
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
