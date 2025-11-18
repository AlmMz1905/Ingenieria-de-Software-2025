import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"; // ¡¡¡ARREGLADO!!!
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, AlertTriangle, Loader2, Building } from "lucide-react";
import farmaGoLogo from "figma:asset/de0da3dcf17f0bdd26c5b82838995987a94fac52.png";

interface RegisterScreenProps {
  onRegister: (data: { email: string; userType: "cliente" | "empleado" }) => void;
  onSwitchToLogin: () => void;
  // --- ¡CAMBIO! ¡Estos props ya no los necesitamos! ---
  // registerEmail: string; 
  // userType: "cliente" | "empleado";
}

// ¡Interface para los datos del formulario!
interface RegisterForm {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  password: string;
  confirmPassword: string;
  userType: "cliente" | "empleado"; // ¡El rol!
  // --- ¡Campos específicos! ---
  dni: string;
  nombre_comercial: string;
  cuit: string;
}

// ¡Interface para los errores!
type FormErrors = Partial<Record<keyof RegisterForm | "acceptTerms", string>>;

export function RegisterScreen({ onRegister, onSwitchToLogin }: RegisterScreenProps) {
  
  // --- ¡Estado único para el formulario! ---
  const [formData, setFormData] = useState<RegisterForm>({
    nombre: "",
    apellido: "",
    email: "", // ¡Arranca vacío!
    telefono: "",
    direccion: "",
    password: "",
    confirmPassword: "",
    userType: "cliente", // ¡Cliente por defecto!
    dni: "",
    nombre_comercial: "",
    cuit: "",
  });
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error general
  const [errors, setErrors] = useState<FormErrors>({}); // Errores de campos
  
  // --- ¡Handler genérico para los inputs! ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };
  
  // ¡Handler para el Select!
  const handleTypeChange = (value: "cliente" | "empleado") => {
    setFormData(prev => ({ ...prev, userType: value }));
  };

  // --- ¡Validaciones! ---
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const { nombre, apellido, email, password, confirmPassword, userType, dni, nombre_comercial, cuit } = formData;

    // Nombre (solo letras)
    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    else if (!/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(nombre)) newErrors.nombre = "El nombre solo debe contener letras.";
    
    // Apellido (solo letras)
    if (!apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    else if (!/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚ]+$/.test(apellido)) newErrors.apellido = "El apellido solo debe contener letras.";

    // Email (formato)
    if (!email.trim()) newErrors.email = "El correo electrónico es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Introduce un formato de correo electrónico válido.";

    // Teléfono (solo números, opcional)
    if (formData.telefono.trim() && !/^\d{7,15}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono solo debe contener números (7-15 dígitos).";
    }

    // Contraseña (8 caracteres)
    if (!password) newErrors.password = "La contraseña es obligatoria.";
    else if (password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    
    // Confirmar Contraseña (que coincida)
    if (confirmPassword !== password) newErrors.confirmPassword = "Las contraseñas no coinciden.";

    // --- ¡Validaciones según el Rol! ---
    if (userType === 'cliente') {
      if (!dni.trim()) newErrors.dni = "El DNI es obligatorio.";
      else if (!/^\d{7,8}$/.test(dni)) newErrors.dni = "Introduce un DNI válido (7 u 8 números).";
    }
    
    if (userType === 'empleado') {
      if (!nombre_comercial.trim()) newErrors.nombre_comercial = "El nombre comercial es obligatorio.";
      if (!cuit.trim()) newErrors.cuit = "El CUIT es obligatorio.";
      else if (!/^\d{11}$/.test(cuit)) newErrors.cuit = "Introduce un CUIT válido (11 números, sin guiones).";
    }
    
    if (!acceptTerms) newErrors.acceptTerms = "Debes aceptar los Términos y Condiciones.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- ¡El "Submit" de verdad! ---
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError("Por favor, corrige los errores en el formulario.");
      return;
    }

    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setError("Error: VITE_API_URL no está configurada.");
      setLoading(false);
      return;
    }
    
    const payload_base = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono.trim() || null,
      direccion: formData.direccion.trim() || null,
      password: formData.password, // ¡El que arreglamos!
    };

    // 2. Definimos el payload final y el endpoint según el rol
    let payload;
    let endpoint;

    if (formData.userType === 'cliente') {
      endpoint = '/auth/register/cliente'; // ¡Ruta sin /api!
      payload = {
        ...payload_base,
        dni: formData.dni, // Le agregamos solo el DNI
      };
    } else { // 'empleado'
      endpoint = '/auth/register/farmacia'; // ¡Ruta sin /api!
      payload = {
        ...payload_base,
        nombre_comercial: formData.nombre_comercial, // Le agregamos lo de farmacia
        cuit: formData.cuit,
      };
    }

    try {
      // --- ¡¡¡CAMBIO!!! ¡Le saqué la barra '/' al final! (El 404) ---
      const response = await fetch(`${apiUrl}${endpoint}`, { // apiUrl (del .env) ya tiene /api
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // ¡Usa el payload limpio!
      });

      if (!response.ok) {
        let errorMessage = `Error al registrar: ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && typeof errData.detail === 'string') {
            errorMessage = errData.detail;
          } else if (errData && errData.detail && errData.detail[0] && errData.detail[0].msg) {
            errorMessage = errData.detail[0].msg;
          }
        } catch (jsonError) {
          console.warn("No se pudo parsear el error del servidor como JSON:", jsonError);
        }
        throw new Error(errorMessage);
      }

      // ¡Registro exitoso!
      onRegister({ email: formData.email, userType: formData.userType }); 

    } catch (err: any) {
      console.error("Error en handleCreateAccount:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error de conexión. Inténtalo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={farmaGoLogo} 
              alt="FarmaGo+" 
              className="w-32 h-32 drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">Crear una Cuenta</h1>
          <p className="text-emerald-700">Tu farmacia digital de confianza</p>
        </div>

        <Card className="border-2 border-emerald-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Completá tus Datos</CardTitle>
            <CardDescription>
              Es rápido y fácil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              className="mb-6 text-emerald-600 hover:text-emerald-700 flex items-center gap-2"
              onClick={onSwitchToLogin}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Iniciar Sesión
            </Button>

            {/* ¡Error general! */}
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 mb-4">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="space-y-6">
            
              {/* --- ¡Selección de Rol! --- */}
              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Cuenta</Label>
                <Select
                  value={formData.userType}
                  onValueChange={handleTypeChange}
                  required
                  disabled={loading}
                >
                  <SelectTrigger id="userType">
                    <SelectValue placeholder="Selecciona tu tipo de cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Cliente (Para comprar productos)
                      </div>
                    </SelectItem>
                    <SelectItem value="empleado">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Empleado (Para gestionar una farmacia)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            
              {/* --- ¡La UI que vos querías! --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="nombre"
                      placeholder="Juan"
                      value={formData.nombre}
                      onChange={handleChange}
                      onBlur={validateForm} 
                      className={`pl-10 ${errors.nombre ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                      disabled={loading}
                    />
                    {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="apellido"
                      placeholder="Pérez"
                      value={formData.apellido}
                      onChange={handleChange}
                      onBlur={validateForm}
                      className={`pl-10 ${errors.apellido ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                      disabled={loading}
                    />
                    {errors.apellido && <p className="text-xs text-red-500 mt-1">{errors.apellido}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={validateForm}
                      className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                      disabled={loading}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono (Opcional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="Ej: 1123456789 (solo números)"
                      value={formData.telefono}
                      onChange={handleChange}
                      onBlur={validateForm}
                      className={`pl-10 ${errors.telefono ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      disabled={loading}
                    />
                    {errors.telefono && <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección (Opcional)</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="direccion"
                    placeholder="Calle Falsa 123"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* --- ¡Campos dinámicos según el Rol! --- */}
              {/* --- ¡¡¡CAMBIO!!! ¡Arreglé el bug! ¡Ahora lee 'formData.userType'! --- */}
              {formData.userType === 'cliente' ? (
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="dni"
                      placeholder="Tu DNI (solo números)"
                      value={formData.dni}
                      onChange={handleChange}
                      onBlur={validateForm}
                      className={`pl-10 ${errors.dni ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                      disabled={loading}
                    />
                    {errors.dni && <p className="text-xs text-red-500 mt-1">{errors.dni}</p>}
                  </div>
                </div>
              ) : ( // ¡Es 'empleado'!
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre_comercial">Nombre de la Farmacia</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="nombre_comercial"
                        placeholder="Farmacia Del Centro"
                        value={formData.nombre_comercial}
                        onChange={handleChange}
                        onBlur={validateForm}
                        className={`pl-10 ${errors.nombre_comercial ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        required
                        disabled={loading}
                      />
                      {errors.nombre_comercial && <p className="text-xs text-red-500 mt-1">{errors.nombre_comercial}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuit">CUIT de la Farmacia</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="cuit"
                        placeholder="Ej: 30123456789 (solo números)"
                        value={formData.cuit}
                        onChange={handleChange}
                        onBlur={validateForm}
                        className={`pl-10 ${errors.cuit ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        required
                        disabled={loading}
                      />
                      {errors.cuit && <p className="text-xs text-red-500 mt-1">{errors.cuit}</p>}
                    </div>
                  </div>
                </div>
              )}
              {/* --- FIN de Campos dinámicos --- */}


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={validateForm}
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    {!errors.password && (
                      <p className="text-xs text-gray-500 mt-1">Mín. 8 caracteres.</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={validateForm}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => {
                    setAcceptTerms(checked as boolean);
                    if (checked) setErrors(prev => ({ ...prev, acceptTerms: undefined }));
                  }}
                  disabled={loading}
                  className={errors.acceptTerms ? 'border-red-500' : ''}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor="acceptTerms" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Acepto los{" "}
                    <a href="#" className="text-emerald-600 hover:underline font-semibold">
                      Términos y Condiciones
                    </a>
                  </Label>
                  {errors.acceptTerms && <p className="text-xs text-red-500 mt-1">{errors.acceptTerms}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* (Footer, igual que antes) */}
        <p className="text-center text-sm text-emerald-700 mt-6">
          Al continuar, aceptas nuestros{" "}
          <a href="#" className="text-emerald-600 hover:underline font-medium">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="text-emerald-600 hover:underline font-medium">
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  );
}