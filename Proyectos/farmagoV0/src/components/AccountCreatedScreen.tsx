import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle } from 'lucide-react';
const farmaGoLogo = "/farmago-logo.png";

interface AccountCreatedScreenProps {
  onGoToLogin: () => void;
}

export function AccountCreatedScreen({ onGoToLogin }: AccountCreatedScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo y título principal */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={farmaGoLogo || "/placeholder.svg"} 
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
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-12 w-12 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            
            <CardTitle className="text-2xl">¡Cuenta Creada Exitosamente!</CardTitle>
            <CardDescription className="mt-3 text-base">
              Tu cuenta ha sido verificada correctamente. Ya puedes acceder a todos los servicios de FarmaGo+.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Success Info Box */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2">¡Bienvenido a FarmaGo+!</h4>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>✓ Gestiona tus recetas médicas de forma digital</li>
                <li>✓ Encuentra farmacias cercanas</li>
                <li>✓ Recibe tus medicamentos en casa</li>
                <li>✓ Consulta con farmacéuticos profesionales</li>
              </ul>
            </div>

            {/* Go to Login Button */}
            <Button
              onClick={onGoToLogin}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Ir a Iniciar Sesión
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-emerald-700 mt-6">
          ¿Necesitas ayuda?{" "}
          <button className="text-emerald-600 hover:underline font-medium">
            Contacta con soporte
          </button>
        </p>
      </div>
    </div>
  );
}
