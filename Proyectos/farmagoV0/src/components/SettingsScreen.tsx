import { useState } from "react";
import { User, MapPin, CreditCard, Bell, Edit, Trash2, Plus, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function SettingsScreen() {
  const [activeTab, setActiveTab] = useState("profile");
  
  const addresses = [
    {
      id: 1,
      name: "Casa",
      address: "Av. Corrientes 1234, CABA",
      isDefault: true,
    },
    {
      id: 2,
      name: "Oficina",
      address: "Av. Santa Fe 567, Recoleta, CABA",
      isDefault: false,
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiry: "06/26",
    },
  ];

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Configuración</h2>
        <p className="text-emerald-50">Gestiona tu perfil y preferencias</p>
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 h-auto p-1 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <User className="h-4 w-4" />
            <span>Mi Perfil</span>
          </TabsTrigger>
          <TabsTrigger 
            value="addresses"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <MapPin className="h-4 w-4" />
            <span>Mis Direcciones</span>
          </TabsTrigger>
          <TabsTrigger 
            value="payments"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <CreditCard className="h-4 w-4" />
            <span>Medios de Pago</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <Bell className="h-4 w-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
        </TabsList>

        {/* Mi Perfil Tab */}
        <TabsContent value="profile">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-emerald-900">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-emerald-200">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-2xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  <Camera className="h-4 w-4 mr-2" />
                  Cambiar foto de perfil
                </Button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input 
                    id="firstName" 
                    defaultValue="John" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input 
                    id="lastName" 
                    defaultValue="Doe" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input 
                    id="dni" 
                    defaultValue="12345678" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue="john.doe@example.com" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input 
                    id="phone" 
                    defaultValue="+54 11 2345-6789" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mis Direcciones Tab */}
        <TabsContent value="addresses">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-900">Direcciones Guardadas</CardTitle>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nueva Dirección
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-emerald-900">{address.name}</h4>
                          {address.isDefault && (
                            <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                              Predeterminada
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{address.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="hover:bg-emerald-100">
                        <Edit className="h-4 w-4 text-emerald-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medios de Pago Tab */}
        <TabsContent value="payments">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-900">Métodos de Pago</CardTitle>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Nuevo Medio de Pago
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-900">{payment.type}</h4>
                        <p className="text-sm text-gray-700">•••• •••• •••• {payment.last4}</p>
                        <p className="text-xs text-gray-600 mt-1">Vence: {payment.expiry}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-red-100">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificaciones Tab */}
        <TabsContent value="notifications">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-emerald-900">Preferencias de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-900">Notificaciones por Email</h4>
                    <p className="text-sm text-gray-600">Recibe actualizaciones en tu correo</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-900">Notificaciones Push</h4>
                    <p className="text-sm text-gray-600">Alertas en tiempo real en tu dispositivo</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
