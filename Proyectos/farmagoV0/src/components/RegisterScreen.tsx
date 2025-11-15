import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, UserCircle, ShoppingBag, Building2, ArrowLeft, Loader2 } from 'lucide-react';
import { Checkbox } from "./ui/checkbox";
const farmaGoLogo = "/farmago-logo.png";

interface RegisterScreenProps {
  onRegister: (accountType: string, email: string) => void;
  onSwitchToLogin: () => void;
  isLoading?: boolean;
}

type UserType = "cliente" | "farmacia" | "";

export function RegisterScreen({ onRegister, onSwitchToLogin, isLoading = false }: RegisterScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    userType: "" as UserType,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData.userType, formData.email);
  };

  const handleContinueToStep2 = () => {
    if (formData.userType) {
      setStep(2);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  const selectUserType = (type: UserType) => {
    setFormData({ ...formData, userType: type });
  };

  const accountTypes = [
    {
      type: "cliente" as UserType,
      title: "Cliente",
      description: "Compra medicamentos y gestiona tus recetas",
      icon: ShoppingBag,
      color: "from-emerald-500 to-teal-500",
    },
    {
      type: "farmacia" as UserType,
      title: "Farmacia",
      description: "Gestiona inventario y atiende clientes",
      icon: Building2,
      color: "from-teal-500 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={farmaGoLogo || "/placeholder.svg"} 
              alt="FarmaGo+" 
              className="w-32 h-32 drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">FarmaGo+</h1>
          <p className="text-emerald-700">Únete a nuestra comunidad</p>
        </div>

        <Card className="border-2 border-emerald-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === 1 ? "Tipo de Cuenta" : "Datos Personales"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "Selecciona el tipo de cuenta que deseas crear" 
                : "Completa tus datos para finalizar el registro"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {accountTypes.map((accountType) => {
                    const Icon = accountType.icon;
                    const isSelected = formData.userType === accountType.type;
                    
                    return (
                      <button
                        key={accountType.type}
                        type="button"
                        onClick={() => selectUserType(accountType.type)}
                        className={`
                          relative p-6 rounded-xl border-2 transition-all duration-300
                          ${isSelected 
                            ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:border-emerald-300 hover:shadow-md bg-white'
                          }
                        `}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`
                            p-3 rounded-lg bg-gradient-to-br ${accountType.color}
                            ${isSelected ? 'shadow-md' : ''}
                          `}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className={`
                              font-semibold mb-1
                              ${isSelected ? 'text-emerald-700' : 'text-gray-900'}
                            `}>
                              {accountType.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {accountType.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button
                  type="button"
                  onClick={handleContinueToStep2}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  disabled={!formData.userType}
                >
                  Continuar
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">o</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta creada?{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-emerald-600 hover:text-emerald-700 font-semibold"
                      onClick={onSwitchToLogin}
                    >
                      Iniciar Sesión
                    </Button>
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToStep1}
                  className="mb-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>

                <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-emerald-700">
                      Tipo de cuenta: <span className="font-semibold">
                        {formData.userType === "cliente" && "Cliente"}
                        {formData.userType === "farmacia" && "Farmacia"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Juan"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Pérez"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+54 11 1234-5678"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="address"
                        type="text"
                        placeholder="Av. Corrientes 1234"
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Password */}
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
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
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
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-tight cursor-pointer"
                  >
                    Acepto los{" "}
                    <a href="#" className="text-emerald-600 hover:underline font-medium">
                      Términos y Condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="#" className="text-emerald-600 hover:underline font-medium">
                      Política de Privacidad
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  disabled={!acceptTerms || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {step === 1 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl shadow-md">
            <h3 className="font-semibold text-emerald-900 mb-2">Beneficios de registrarte:</h3>
            <ul className="text-sm text-emerald-800 space-y-1">
              <li>✓ Gestión de recetas médicas digital</li>
              <li>✓ Consultas con farmacéuticos profesionales</li>
              <li>✓ Delivery rápido a tu domicilio</li>
              <li>✓ Descuentos exclusivos y promociones</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
