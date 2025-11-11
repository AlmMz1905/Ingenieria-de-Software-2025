import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mail, Lock, Eye, EyeOff, UserCircle } from "lucide-react";
import farmaGoLogo from "figma:asset/de0da3dcf17f0bdd26c5b82838995987a94fac52.png";

interface LoginScreenProps {
  onLogin: (accountType: string) => void;
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
}

export function LoginScreen({ onLogin, onSwitchToRegister, onForgotPassword }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular inicio de sesión y pasar el tipo de cuenta
    onLogin(accountType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo y título principal */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={farmaGoLogo} 
              alt="FarmaGo+" 
              className="w-32 h-32 drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">FarmaGo+</h1>
          <p className="text-emerald-700">Tu farmacia digital de confianza</p>
        </div>

        <Card className="border-2 border-emerald-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Account Type */}
              <div className="space-y-2">
                <Label htmlFor="accountType">Tipo de Cuenta</Label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <Select
                    value={accountType}
                    onValueChange={setAccountType}
                    required
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Selecciona tu tipo de cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="empleado">Empleado de Farmacia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Recordar mi sesión
                </Label>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  onClick={onForgotPassword}
                >
                  ¿Has olvidado tu contraseña?
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
                size="lg"
                disabled={!accountType}
              >
                Iniciar Sesión
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿No tenes una cuenta?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-emerald-600 hover:text-emerald-700 font-semibold"
                    onClick={onSwitchToRegister}
                  >
                    Registra una nueva aquí
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
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