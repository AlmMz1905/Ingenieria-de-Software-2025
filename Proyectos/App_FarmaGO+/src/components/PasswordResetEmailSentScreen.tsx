import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Mail, CheckCircle } from "lucide-react";
import farmaGoLogo from "figma:asset/de0da3dcf17f0bdd26c5b82838995987a94fac52.png";

interface PasswordResetEmailSentScreenProps {
  email?: string;
  onBackToLogin: () => void;
}

export function PasswordResetEmailSentScreen({ 
  email, 
  onBackToLogin 
}: PasswordResetEmailSentScreenProps) {
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
            {/* Success Icon */}
            <div className="mx-auto mb-4">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <Mail className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle className="h-5 w-5 text-white fill-white" />
                </div>
              </div>
            </div>
            
            <CardTitle className="text-2xl">¡Revisa tu correo!</CardTitle>
            <CardDescription className="mt-3 text-base">
              Hemos enviado un enlace de restablecimiento de contraseña a{" "}
              <span className="font-semibold text-emerald-700">
                {email || "tu correo electrónico"}
              </span>
              . Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Info Box */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
              <p className="text-sm text-emerald-900">
                <strong>Nota:</strong> El enlace es válido por 24 horas. Si no recibes el correo, revisa tu carpeta de spam.
              </p>
            </div>

            {/* Back to Login Button */}
            <Button
              onClick={onBackToLogin}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Volver al Inicio de Sesión
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-emerald-700 mt-6">
          ¿No recibiste el correo?{" "}
          <button className="text-emerald-600 hover:underline font-medium">
            Reenviar enlace
          </button>
        </p>
      </div>
    </div>
  );
}
