import { useState, useEffect } from "react"; // ¡Importamos!
import { Store, Shield, Trash2, AlertTriangle, Loader2 } from "lucide-react"; // ¡Importamos!
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea"; // (Este ya estaba)
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
import { toast } from "sonner"; // ¡Importamos!

// --- ¡NUEVO! Interfaces que coinciden con nuestro Backend ---
// (Esta la robamos de schemas.py)
interface FarmaciaResponse {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  direccion: string | null; // La dirección "principal"
  nombre_comercial: string;
  cuit: string;
  horario_apertura: string | null;
  horario_cierre: string | null;
}

// --- ¡NUEVO! Props (¡Ahora acepta el onDelete!) ---
interface PharmacySettingsScreenProps {
  onDeleteAccount?: () => void;
  onNavigate: (section: string) => void; // (Lo tomamos de tu Dashboard)
}

// --- ¡NUEVO! Estado para el formulario de Horarios ---
// (Creamos un formato más amigable)
type HorariosState = {
  lunesViernes: string;
  sabados: string;
  domingos: string;
};

// --- ¡NUEVO! Función "traductora" ---
// (Esto convierte el texto feo "Lunes a..." en dos campos "08:00" y "20:00")
const parseHorariosToState = (horarioApertura: string | null, horarioCierre: string | null): HorariosState => {
  // ¡MAQUETA! Asumimos que la data del backend se guarda en otro formato.
  // Por ahora, solo mostramos la maqueta.
  return {
    lunesViernes: "8:00 - 20:00",
    sabados: "9:00 - 14:00",
    domingos: "Cerrado"
  };
};
// ¡NUEVO! Función "traductora" inversa
// (Esto convierte el formulario de horarios en los dos campos del backend)
const parseHorariosToApi = (horarios: HorariosState): { horario_apertura: string, horario_cierre: string } => {
  // ¡MAQUETA! Faltaría lógica real aquí.
  // Por ahora, devolvemos los horarios fijos del 'seed_db.py'.
  return {
    horario_apertura: "08:00",
    horario_cierre: "20:00"
  };
};


export function PharmacySettingsScreen({ onDeleteAccount, onNavigate }: PharmacySettingsScreenProps) {
  const [activeTab, setActiveTab] = useState("profile");

  // --- ¡NUEVO! Estados para la data Real ---
  const [profile, setProfile] = useState<FarmaciaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- ¡NUEVO! Estado para el formulario "Editar Perfil" ---
  const [formData, setFormData] = useState({
    nombre_comercial: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [horarios, setHorarios] = useState<HorariosState>({ lunesViernes: "", sabados: "", domingos: "" });
  
  // --- ¡NUEVO! Estado para "Cambiar Contraseña" ---
  const [passwords, setPasswords] = useState({
    contraseña_actual: "",
    nueva_contraseña: "",
    confirmar_contraseña: ""
  });
  const [passwordError, setPasswordError] = useState("");
  
  // Estados de "cargando" para botones
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // --- ¡NUEVO! Handlers para formularios ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleHorariosChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // ¡MAQUETA! Faltaría un parser más complejo aquí.
    // Por ahora, no dejamos que se edite el textarea.
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswords(prev => ({ ...prev, [id]: value }));
    if (passwordError) setPasswordError("");
  };


  // --- ¡¡¡LA MAGIA!!! Carga los datos del perfil al montar ---
  useEffect(() => {
    const fetchProfile = async () => {
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
        
        const data: FarmaciaResponse = await response.json();
        setProfile(data);
        
        // ¡Rellena el formulario con los datos reales!
        setFormData({
          nombre_comercial: data.nombre_comercial,
          direccion: data.direccion || "", // (Usa la dirección 'principal' del Usuario)
          telefono: data.telefono || "",
          email: data.email,
        });
        // ¡Traduce los horarios!
        setHorarios(parseHorariosToState(data.horario_apertura, data.horario_cierre));

      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []); // El '[]' hace que se ejecute 1 sola vez al cargar
  
  
  // --- ¡"ENCHUFADO"! Función para Guardar Perfil ---
  const handleSaveProfile = async () => {
    setProfileLoading(true);
    const token = localStorage.getItem("authToken");
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Por favor, ingresa un email válido.");
      setProfileLoading(false);
      return;
    }
    
    // Traducimos los horarios de vuelta al formato de la API
    const horariosApi = parseHorariosToApi(horarios);

    try {
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // ¡Usamos el schema 'FarmaciaUpdate'!
          nombre_comercial: formData.nombre_comercial,
          direccion: formData.direccion,
          telefono: formData.telefono,
          email: formData.email,
          horario_apertura: horariosApi.horario_apertura,
          horario_cierre: horariosApi.horario_cierre,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Error al actualizar el perfil.");
      }
      
      const updatedProfile: FarmaciaResponse = await response.json();
      setProfile(updatedProfile);
      
      const nombreCompleto = `${updatedProfile.nombre_comercial}`; // ¡La farmacia usa 'nombre_comercial'!
      localStorage.setItem("userName", nombreCompleto);

      toast.success("¡Perfil actualizado exitosamente!");
      
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProfileLoading(false);
    }
  };


  // --- ¡"ENCHUFADO"! Función para Cambiar Contraseña ---
  // (¡Es idéntica a la del Cliente!)
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


  // --- ¡"ENCHUFADO"! Función para Eliminar Cuenta ---
  // (¡Es idéntica a la del Cliente!)
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
        // ¡Usamos el prop que nos pasa App.tsx!
        if (onDeleteAccount) {
          onDeleteAccount();
        }
      }, 2000);
      
    } catch (err: any) {
      toast.error(err.message);
      setDeleteLoading(false);
    }
  };


  // --- ¡NUEVO! Pantallas de Carga y Error ---
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
            <p className="text-red-800">{error || "No se pudo encontrar el perfil de la farmacia."}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  

  // --- ¡El Render! (Ahora usa los datos Reales) ---
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header (igual) */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Configuración</h2>
        <p className="text-emerald-50">Administra la información de tu farmacia y seguridad de la cuenta</p>
      </div>

      {/* Tabs Container (igual) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-auto p-1 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <TabsTrigger 
            value="profile" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <Store className="h-4 w-4" />
            <span>Perfil de Farmacia</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white flex items-center gap-2 py-3"
          >
            <Shield className="h-4 w-4" />
            <span>Seguridad</span>
          </TabsTrigger>
        </TabsList>

        {/* Edit Pharmacy Profile Tab (¡"ENCHUFADO"!) */}
        <TabsContent value="profile">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-emerald-900">Información de la Farmacia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nombre_comercial">Nombre de la Farmacia</Label>
                  <Input 
                    id="nombre_comercial" 
                    value={formData.nombre_comercial} // <-- ¡Dato real!
                    onChange={handleFormChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input 
                    id="direccion" 
                    value={formData.direccion} // <-- ¡Dato real!
                    onChange={handleFormChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input 
                    id="telefono" 
                    value={formData.telefono} // <-- ¡Dato real!
                    onChange={handleFormChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contacto</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email} // <-- ¡Dato real!
                    onChange={handleFormChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Business Hours */}
              <div className="space-y-2">
                <Label htmlFor="hours">Horario de Atención (Maqueta)</Label>
                <Textarea
                  id="hours"
                  // ¡Juntamos los horarios!
                  value={`Lunes a Viernes: ${horarios.lunesViernes}\nSábados: ${horarios.sabados}\nDomingos: ${horarios.domingos}`}
                  readOnly // ¡Lo hacemos de solo lectura por ahora!
                  rows={4}
                  className="border-emerald-200 focus:ring-emerald-500 resize-none bg-gray-50"
                />
                <p className="text-xs text-gray-500">Este horario será visible para los clientes. (La edición de horarios es una maqueta).</p>
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

        {/* Security Tab (¡"ENCHUFADO"!) */}
        <TabsContent value="security">
          <div className="space-y-4">
            {/* Change Password */}
            <Card className="border-2 border-emerald-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-900">Cambiar Contraseña</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contraseña_actual_farm">Contraseña Actual</Label>
                  <Input 
                    id="contraseña_actual" // ¡El ID debe ser el del estado!
                    type="password"
                    value={passwords.contraseña_actual}
                    onChange={handlePasswordChange}
                    className="border-emerald-200 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nueva_contraseña_farm">Nueva Contraseña</Label>
                  <Input 
                    id="nueva_contraseña" // ¡El ID debe ser el del estado!
                    type="password"
                    value={passwords.nueva_contraseña}
                    onChange={handlePasswordChange}
                    className={`${passwordError.includes("8 caracteres") ? 'border-red-500' : 'border-emerald-200'} focus:ring-emerald-500`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmar_contraseña_farm">Confirmar Nueva Contraseña</Label>
                  <Input 
                    id="confirmar_contraseña" // ¡El ID debe ser el del estado!
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
                  <h4 className="font-semibold text-red-900 mb-2">Eliminar Cuenta de Farmacia</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Una vez que elimines la cuenta de tu farmacia, no hay vuelta atrás. Todos los datos, 
                    recetas procesadas e información de clientes se perderán permanentemente. 
                    Por favor, asegúrate de que realmente quieres hacer esto.
                  </p>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Cuenta de Farmacia
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta
                          de tu farmacia y removerá todos los datos de nuestros servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          disabled={deleteLoading}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sí, eliminar cuenta"}
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