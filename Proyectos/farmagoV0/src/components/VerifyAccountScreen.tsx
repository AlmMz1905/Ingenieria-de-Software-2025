import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mail, ArrowLeft } from 'lucide-react';
const farmaGoLogo = "/farmago-logo.png";

interface VerifyAccountScreenProps {
  email: string;
  onVerify: (code: string) => void;
  onResendCode: () => void;
  onBackToRegister?: () => void;
}

export function VerifyAccountScreen({ 
  email, 
  onVerify, 
  onResendCode,
  onBackToRegister 
}: VerifyAccountScreenProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Solo permitir un dígito
    if (!/^\d*$/.test(value)) return; // Solo permitir números

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus al siguiente input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split("").concat(Array(6 - pastedData.length).fill(""));
    setCode(newCode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    
    if (fullCode.length !== 6) {
      setError("Por favor, ingresa el código completo de 6 dígitos");
      return;
    }

    setError("");
    onVerify(fullCode);
  };

  const handleResendCode = () => {
    setCode(["", "", "", "", "", ""]);
    setError("");
    onResendCode();
  };

  const isCodeComplete = code.every(digit => digit !== "");

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
            <div className="mx-auto mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl">Verifica tu Cuenta</CardTitle>
            <CardDescription className="mt-3">
              Hemos enviado un código de 6 dígitos a{" "}
              <span className="font-semibold text-emerald-700">{email}</span>. 
              Por favor, ingrésalo a continuación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Code Input Fields */}
              <div>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-semibold border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-sm text-red-600 mt-2 text-center">{error}</p>
                )}
              </div>

              {/* Info Box */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                <p className="text-sm text-emerald-900 text-center">
                  El código es válido por 10 minutos. Si no lo recibes, revisa tu carpeta de spam.
                </p>
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                size="lg"
                disabled={!isCodeComplete}
              >
                Verificar Cuenta
              </Button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿No recibiste el código?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-emerald-600 hover:text-emerald-700 font-semibold"
                    onClick={handleResendCode}
                  >
                    Reenviar código
                  </Button>
                </p>
              </div>

              {/* Back to Register (optional) */}
              {onBackToRegister && (
                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1 mx-auto"
                    onClick={onBackToRegister}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al Registro
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
