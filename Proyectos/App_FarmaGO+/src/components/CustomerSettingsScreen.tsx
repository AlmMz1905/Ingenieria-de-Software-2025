import { useState } from "react";
import { User, MapPin, Shield, Trash2, Plus, Edit, AlertTriangle, CreditCard, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface CustomerSettingsScreenProps {
  initialTab?: string;
  onDeleteAccount?: () => void;
}

export function CustomerSettingsScreen({ initialTab = "profile", onDeleteAccount }: CustomerSettingsScreenProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [email, setEmail] = useState("maria.gonzalez@example.com");
  const [emailError, setEmailError] = useState("");

  const addresses = [
    {
      id: 1,
      name: "Casa",
      address: "Calle 7 N° 822, La Plata, Buenos Aires",
      isDefault: true,
    },
    {
      id: 2,
      name: "Trabajo",
      address: "Av. 51 N° 1234, La Plata, Buenos Aires",
      isDefault: false,
    },
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      lastFour: "4242",
      expiryDate: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      lastFour: "8888",
      expiryDate: "09/25",
      isDefault: false,
    },
  ];

  const handleDeleteAccount = () => {
    alert("Tu cuenta ha sido eliminada exitosamente. Lamentamos verte partir.");
    if (onDeleteAccount) {
      onDeleteAccount();
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, ingresa un email válido.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleSaveProfile = () => {
    if (validateEmail(email)) {
      toast.success("Cambios guardados exitosamente.");
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Configuración</h2>
        <p className="text-emerald-50">Administra tu cuenta y preferencias personales</p>
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 h-auto p-1 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <User className="h-4 w-4" />
            <span>Editar Perfil</span>
          </TabsTrigger>
          <TabsTrigger 
            value="addresses"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <MapPin className="h-4 w-4" />
            <span>Direcciones</span>
          </TabsTrigger>
          <TabsTrigger 
            value="payment"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <CreditCard className="h-4 w-4" />
            <span>Métodos de Pago</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <Shield className="h-4 w-4" />
            <span>Seguridad</span>
          </TabsTrigger>
        </TabsList>

        {/* Edit Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-emerald-900">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input 
                    id="firstName" 
                    defaultValue="María" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input 
                    id="lastName" 
                    defaultValue="González" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={handleEmailChange}
                    className={`${emailError ? 'border-red-500 focus:ring-red-500' : 'border-emerald-200 focus:ring-emerald-500'}`}
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {emailError} Por favor, ingresa un formato válido como aa@bb.com
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input 
                    id="phone" 
                    defaultValue="+54 221 456-7890" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <Button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" onClick={handleSaveProfile}>
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Addresses Tab */}
        <TabsContent value="addresses">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-900">Direcciones de Entrega</CardTitle>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Dirección
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

        {/* Payment Methods Tab */}
        <TabsContent value="payment">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-900">Métodos de Pago</CardTitle>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Método de Pago
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-emerald-900">{method.type}</h4>
                          {method.isDefault && (
                            <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                              Predeterminada
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">Termina en {method.lastFour}, expira {method.expiryDate}</p>
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

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-4">
            {/* Change Password */}
            <Card className="border-2 border-emerald-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-900">Cambiar Contraseña</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <Button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  Actualizar Contraseña
                </Button>
              </CardContent>
            </Card>

            {/* Delete Account */}
            <Card className="border-2 border-red-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Zona de Peligro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-2">Eliminar Cuenta</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de que realmente quieres hacer esto.
                  </p>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar mi Cuenta
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta
                          y removerá tus datos de nuestros servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sí, eliminar mi cuenta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}