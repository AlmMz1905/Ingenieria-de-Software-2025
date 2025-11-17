import { useState, useEffect } from "react";
import { User, MapPin, Shield, Trash2, Plus, Edit, AlertTriangle, CreditCard, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";

// --- Interfaces ---
interface Direccion {
  id_direccion: number;
  alias: string;
  calle_numero: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string | null;
  es_predeterminada: boolean;
}
interface MetodoDePago {
  id_metodo_pago: number;
  tipo: string;
  ultimos_cuatro: string;
  fecha_expiracion: string;
  nombre_titular: string;
  es_predeterminado: boolean;
}
interface ClienteResponse {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  dni: string;
  direcciones: Direccion[];
  metodos_de_pago: MetodoDePago[];
}

// --- Props ---
interface CustomerSettingsScreenProps {
  initialTab?: string;
  onDeleteAccount?: () => void;
}

// --- Estados de Formularios ---
type DireccionFormState = {
  id_direccion?: number;
  alias: string;
  calle_numero: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string;
  es_predeterminada: boolean;
};

type PaymentFormState = {
  id_metodo_pago?: number;
  tipo: string;
  ultimos_cuatro: string;
  fecha_expiracion: string; // MM/YY
  nombre_titular: string;
  es_predeterminado: boolean;
};


export function CustomerSettingsScreen({ initialTab = "profile", onDeleteAccount }: CustomerSettingsScreenProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [profile, setProfile] = useState<ClienteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de formularios (perfil, contraseña)
  const [formData, setFormData] = useState({ nombre: "", apellido: "", email: "", telefono: "", dni: "" });
  const [passwords, setPasswords] = useState({ contraseña_actual: "", nueva_contraseña: "", confirmar_contraseña: "" });
  const [passwordError, setPasswordError] = useState("");
  
  // Estados de "cargando" para botones
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false); // Genérico para pop-ups

  // --- Estados para Pop-ups ---
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState<DireccionFormState>({ alias: "", calle_numero: "", ciudad: "", provincia: "", codigo_postal: "", es_predeterminada: false });
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>({ tipo: "Visa", ultimos_cuatro: "", fecha_expiracion: "", nombre_titular: "", es_predeterminado: false });

  // Estado para la Alerta de Borrado
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: 'address' | 'payment' } | null>(null);


  // --- Carga de Perfil ---
  const loadProfile = async () => {
    setLoading(true); 
    setError(null);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!token || !apiUrl) {
      setError("No estás autenticado o la API no está configurada.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "No se pudo cargar tu perfil.");
      }
      const data: ClienteResponse = await response.json();
      setProfile(data);
      setFormData({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono || "",
        dni: data.dni,
      });
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { loadProfile(); }, []);
  
  // --- Handlers de formularios ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswords(prev => ({ ...prev, [id]: value }));
    if (passwordError) setPasswordError("");
  };
  
  // --- Handlers de Acciones de Perfil ---
  const handleSaveProfile = async () => {
    setProfileLoading(true);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Por favor, ingresa un email válido.");
      setProfileLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          dni: formData.dni,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error al actualizar el perfil.");
      }
      
      const updatedProfile: ClienteResponse = await response.json();
      setProfile(updatedProfile);
      
      const nombreCompleto = `${updatedProfile.nombre} ${updatedProfile.apellido}`;
      localStorage.setItem("userName", nombreCompleto);
      
      toast.success("¡Perfil actualizado exitosamente!");
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProfileLoading(false);
    }
  };
  const handleUpdatePassword = async () => {
    setPasswordError("");
    
    if (passwords.nueva_contraseña.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (passwords.nueva_contraseña !== passwords.confirmar_contraseña) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }
    
    setPasswordLoading(true);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/users/profile/change-password`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contraseña_actual: passwords.contraseña_actual,
          nueva_contraseña: passwords.nueva_contraseña,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error al cambiar la contraseña.");
      }
      
      toast.success("¡Contraseña actualizada exitosamente!");
      setPasswords({
        contraseña_actual: "",
        nueva_contraseña: "",
        confirmar_contraseña: ""
      });

    } catch (err: any) {
      toast.error(err.message);
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "No se pudo eliminar la cuenta.");
      }
      
      toast.success("Tu cuenta ha sido eliminada. Te estamos redirigiendo...");
      
      setTimeout(() => {
        if (onDeleteAccount) {
          onDeleteAccount();
        }
      }, 2000);
      
    } catch (err: any) {
      toast.error(err.message);
      setDeleteLoading(false);
    }
  };


  // --- Handlers para CRUD de Direcciones ---
  const handleAddNewAddress = () => {
    setAddressForm({
      alias: "",
      calle_numero: "",
      ciudad: "La Plata",
      provincia: "Buenos Aires",
      codigo_postal: "",
      es_predeterminada: false,
    });
    setShowAddressModal(true);
  };
  const handleEditAddress = (address: Direccion) => {
    setAddressForm({
      id_direccion: address.id_direccion,
      alias: address.alias,
      calle_numero: address.calle_numero,
      ciudad: address.ciudad,
      provincia: address.provincia,
      codigo_postal: address.codigo_postal || "",
      es_predeterminada: address.es_predeterminada,
    });
    setShowAddressModal(true);
  };
  const handleSaveAddress = async () => {
    setFormLoading(true);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const isEditing = !!addressForm.id_direccion;
    const url = isEditing 
      ? `${apiUrl}/users/profile/addresses/${addressForm.id_direccion}`
      : `${apiUrl}/users/profile/addresses`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          alias: addressForm.alias,
          calle_numero: addressForm.calle_numero,
          ciudad: addressForm.ciudad,
          provincia: addressForm.provincia,
          codigo_postal: addressForm.codigo_postal || null,
          es_predeterminada: addressForm.es_predeterminada,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error al guardar la dirección.");
      }

      toast.success(`Dirección ${isEditing ? 'actualizada' : 'creada'} con éxito.`);
      setShowAddressModal(false); 
      loadProfile(); 

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };
  const confirmDeleteAddress = async () => {
    if (!itemToDelete || itemToDelete.type !== 'address') return;
    
    setDeleteLoading(true);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/users/profile/addresses/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error al eliminar la dirección.");
      }
      
      toast.success("Dirección eliminada.");
      setShowDeleteAlert(false);
      setItemToDelete(null);
      loadProfile(); 

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  
  // --- Handlers para CRUD de Métodos de Pago ---
  const handleAddNewPayment = () => {
    setPaymentForm({
      tipo: "Visa",
      ultimos_cuatro: "",
      fecha_expiracion: "",
      nombre_titular: profile ? `${profile.nombre} ${profile.apellido}` : "", 
      es_predeterminado: false,
    });
    setShowPaymentModal(true);
  };
  const handleEditPayment = (payment: MetodoDePago) => {
    setPaymentForm({
      id_metodo_pago: payment.id_metodo_pago,
      tipo: payment.tipo,
      ultimos_cuatro: payment.ultimos_cuatro,
      fecha_expiracion: payment.fecha_expiracion,
      nombre_titular: payment.nombre_titular,
      es_predeterminado: payment.es_predeterminado,
    });
    setShowPaymentModal(true);
  };
  const handleSavePayment = async () => {
    setFormLoading(true);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL;
    
    if (paymentForm.ultimos_cuatro.length !== 4 || !/^\d+$/.test(paymentForm.ultimos_cuatro)) {
      toast.error("Los últimos 4 dígitos deben ser solo números.");
      setFormLoading(false);
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentForm.fecha_expiracion)) {
      toast.error("La fecha de expiración debe tener el formato MM/YY (ej: 12/26).");
      setFormLoading(false);
      return;
    }
    if (!paymentForm.nombre_titular.trim()) {
      toast.error("El nombre del titular es obligatorio.");
      setFormLoading(false);
      return;
    }

    const isEditing = !!paymentForm.id_metodo_pago;
    const url = isEditing 
      ? `${apiUrl}/users/profile/payment-methods/${paymentForm.id_metodo_pago}`
      : `${apiUrl}/users/profile/payment-methods`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: paymentForm.tipo,
          ultimos_cuatro: paymentForm.ultimos_cuatro,
          fecha_expiracion: paymentForm.fecha_expiracion,
          nombre_titular: paymentForm.nombre_titular,
          es_predeterminado: paymentForm.es_predeterminado,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error al guardar el método de pago.");
      }

      toast.success(`Método de pago ${isEditing ? 'actualizado' : 'agregado'} con éxito.`);
      setShowPaymentModal(false); 
      loadProfile(); 

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };
  const confirmDeletePayment = async () => {
    if (!itemToDelete || itemToDelete.type !== 'payment') return;
    
    setDeleteLoading(true);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/users/profile/payment-methods/${itemToDelete.id}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error al eliminar el método de pago.");
      }
      
      toast.success("Método de pago eliminado.");
      setShowDeleteAlert(false);
      setItemToDelete(null);
      loadProfile(); 

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Abre el pop-up de "Confirmar Eliminación"
  const handleDeleteClick = (id: number, type: 'address' | 'payment') => {
    setItemToDelete({ id, type });
    setShowDeleteAlert(true);
  };


  // --- Pantallas de Carga y Error ---
  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error al cargar el perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800">{error || "No se pudo encontrar el perfil del usuario."}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  
  // --- ¡El Render! ---
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Configuración</h2>
        <p className="text-emerald-50">Administra tu cuenta y preferencias personales</p>
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* ¡¡¡ESTA VEZ SÍ ESTÁN LAS TABS!!! */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input 
                    id="nombre" 
                    value={formData.nombre} 
                    onChange={handleFormChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input 
                    id="apellido" 
                    value={formData.apellido} 
                    onChange={handleFormChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleFormChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input 
                    id="telefono" 
                    value={formData.telefono} 
                    onChange={handleFormChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input 
                    id="dni" 
                    value={formData.dni} 
                    onChange={handleFormChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <Button 
                className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                onClick={handleSaveProfile}
                disabled={profileLoading}
              >
                {profileLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Cambios"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Addresses Tab */}
        <TabsContent value="addresses">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-900">Direcciones de Entrega</CardTitle>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                onClick={handleAddNewAddress} 
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Dirección
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.direcciones.length === 0 ? (
                <p className="text-gray-500 text-center p-4">
                  No tenés direcciones guardadas. ¡Agregá una!
                </p>
              ) : (
                profile.direcciones.map((address) => (
                  <div
                    key={address.id_direccion}
                    className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-emerald-900">{address.alias}</h4>
                            {address.es_predeterminada && (
                              <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{address.calle_numero}, {address.ciudad}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-emerald-100"
                          onClick={() => handleEditAddress(address)} 
                        >
                          <Edit className="h-4 w-4 text-emerald-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-red-100"
                          onClick={() => handleDeleteClick(address.id_direccion, 'address')} 
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-900">Métodos de Pago</CardTitle>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                onClick={handleAddNewPayment} 
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Método de Pago
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.metodos_de_pago.length === 0 ? (
                <p className="text-gray-500 text-center p-4">
                  No tenés métodos de pago guardados.
                </p>
              ) : (
                profile.metodos_de_pago.map((method) => (
                  <div
                    key={method.id_metodo_pago}
                    className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-emerald-900">{method.tipo}</h4>
                            {method.es_predeterminado && (
                              <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            Termina en {method.ultimos_cuatro}, expira {method.fecha_expiracion}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-emerald-100"
                          onClick={() => handleEditPayment(method)} 
                        >
                          <Edit className="h-4 w-4 text-emerald-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-red-100"
                          onClick={() => handleDeleteClick(method.id_metodo_pago, 'payment')} 
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ¡¡¡ESTA VEZ SÍ ESTÁ LA PESTAÑA DE SEGURIDAD!!! */}
        <TabsContent value="security">
          <div className="space-y-4">
            {/* Change Password */}
            <Card className="border-2 border-emerald-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-900">Cambiar Contraseña</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contraseña_actual">Contraseña Actual</Label>
                  <Input 
                    id="contraseña_actual"
                    type="password"
                    value={passwords.contraseña_actual}
                    onChange={handlePasswordChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nueva_contraseña">Nueva Contraseña</Label>
                  <Input 
                    id="nueva_contraseña"
                    type="password"
                    value={passwords.nueva_contraseña}
                    onChange={handlePasswordChange}
                    className={`${passwordError.includes("8 caracteres") ? 'border-red-500' : 'border-emerald-200'} focus:ring-emerald-500`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmar_contraseña">Confirmar Nueva Contraseña</Label>
                  <Input 
                    id="confirmar_contraseña"
                    type="password"
                    value={passwords.confirmar_contraseña}
                    onChange={handlePasswordChange}
                    className={`${passwordError.includes("no coinciden") ? 'border-red-500' : 'border-emerald-200'} focus:ring-emerald-500`}
                  />
                </div>
                
                {passwordError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {passwordError}
                  </p>
                )}
                
                <Button 
                  className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  onClick={handleUpdatePassword}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualizar Contraseña"}
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
                          disabled={deleteLoading}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sí, eliminar mi cuenta"}
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

      {/* Pop-up de Direcciones */}
      <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{addressForm.id_direccion ? 'Editar Dirección' : 'Agregar Nueva Dirección'}</DialogTitle>
            <DialogDescription>
              Completá los datos de tu dirección de entrega.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="alias">Alias (Ej: Casa, Trabajo)</Label>
              <Input
                id="alias"
                value={addressForm.alias}
                onChange={(e) => setAddressForm(f => ({ ...f, alias: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calle_numero">Calle y Número</Label>
              <Input
                id="calle_numero"
                value={addressForm.calle_numero}
                onChange={(e) => setAddressForm(f => ({ ...f, calle_numero: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  value={addressForm.ciudad}
                  onChange={(e) => setAddressForm(f => ({ ...f, ciudad: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provincia">Provincia</Label>
                <Input
                  id="provincia"
                  value={addressForm.provincia}
                  onChange={(e) => setAddressForm(f => ({ ...f, provincia: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo_postal">Código Postal</Label>
              <Input
                id="codigo_postal"
                value={addressForm.codigo_postal}
                onChange={(e) => setAddressForm(f => ({ ...f, codigo_postal: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="es_predeterminada"
                checked={addressForm.es_predeterminada}
                onCheckedChange={(checked) => setAddressForm(f => ({ ...f, es_predeterminada: checked as boolean }))}
              />
              <Label htmlFor="es_predeterminada" className="cursor-pointer">
                Usar como dirección predeterminada
              </Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={handleSaveAddress}
              disabled={formLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Dirección"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Pop-up de Pagos */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{paymentForm.id_metodo_pago ? 'Editar Método de Pago' : 'Agregar Método de Pago'}</DialogTitle>
            <DialogDescription>
              Completá los datos de tu tarjeta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_titular">Nombre del Titular</Label>
              <Input
                id="nombre_titular"
                value={paymentForm.nombre_titular}
                onChange={(e) => setPaymentForm(f => ({ ...f, nombre_titular: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="ultimos_cuatro">Últimos 4 Dígitos</Label>
                <Input
                  id="ultimos_cuatro"
                  placeholder="4242"
                  maxLength={4}
                  value={paymentForm.ultimos_cuatro}
                  onChange={(e) => setPaymentForm(f => ({ ...f, ultimos_cuatro: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_expiracion">Expira (MM/YY)</Label>
                <Input
                  id="fecha_expiracion"
                  placeholder="12/26"
                  maxLength={5}
                  value={paymentForm.fecha_expiracion}
                  onChange={(e) => setPaymentForm(f => ({ ...f, fecha_expiracion: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Tarjeta</Label>
              <Input
                id="tipo"
                placeholder="Visa"
                value={paymentForm.tipo}
                onChange={(e) => setPaymentForm(f => ({ ...f, tipo: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="es_predeterminado_pago"
                checked={paymentForm.es_predeterminado}
                onCheckedChange={(checked) => setPaymentForm(f => ({ ...f, es_predeterminado: checked as boolean }))}
              />
              <Label htmlFor="es_predeterminado_pago" className="cursor-pointer">
                Usar como método de pago predeterminado
              </Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={handleSavePayment}
              disabled={formLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Método"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Pop-up de Eliminar (Genérico) */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar esto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
              {itemToDelete?.type === 'address' && ' La dirección será eliminada permanentemente.'}
              {itemToDelete?.type === 'payment' && ' El método de pago será eliminado permanentemente.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (itemToDelete?.type === 'address') {
                  confirmDeleteAddress();
                } else if (itemToDelete?.type === 'payment') {
                  confirmDeletePayment();
                }
              }}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}