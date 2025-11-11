import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import farmaGoLogo from "figma:asset/de0da3dcf17f0bdd26c5b82838995987a94fac52.png";

interface PasswordResetRequestScreenProps {
  onBackToLogin: () => void;
  onSendResetLink: (email: string) => void;
}

export function PasswordResetRequestScreen({ 
  onBackToLogin, 
  onSendResetLink 
}: PasswordResetRequestScreenProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendResetLink(email);
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
            <CardTitle className="text-2xl">Restablecer Contraseña</CardTitle>
            <CardDescription className="mt-3">
              Ingresa el correo electrónico asociado con tu cuenta, y te enviaremos un enlace para restablecer tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                Enviar Enlace de Restablecimiento
              </Button>

              {/* Back to Login Link */}
              <div className="text-center pt-2">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 mx-auto"
                  onClick={onBackToLogin}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al Inicio de Sesión
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-emerald-700 mt-6">
          Si no recibes el correo en unos minutos, revisa tu carpeta de spam o{" "}
          <button 
            className="text-emerald-600 hover:underline font-medium"
            onClick={onBackToLogin}
          >
            contacta con soporte
          </button>
        </p>
      </div>
    </div>
  );
}
