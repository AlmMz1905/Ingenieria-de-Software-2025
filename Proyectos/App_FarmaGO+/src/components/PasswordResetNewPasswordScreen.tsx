import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import farmaGoLogo from "figma:asset/de0da3dcf17f0bdd26c5b82838995987a94fac52.png";

interface PasswordResetNewPasswordScreenProps {
  onPasswordReset: (newPassword: string) => void;
  onBackToLogin?: () => void;
}

export function PasswordResetNewPasswordScreen({ 
  onPasswordReset,
  onBackToLogin
}: PasswordResetNewPasswordScreenProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";
  const passwordLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const isValidPassword = passwordLength && hasNumber && hasSpecialChar && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidPassword) {
      onPasswordReset(newPassword);
    }
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
            <CardTitle className="text-2xl">Crear Nueva Contraseña</CardTitle>
            <CardDescription className="mt-3">
              Tu nueva contraseña debe ser segura y diferente de las anteriores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              {/* Password Requirements */}
              {newPassword && (
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 space-y-2">
                  <p className="text-sm font-semibold text-emerald-900 mb-2">Requisitos de contraseña:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {passwordLength ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-sm ${passwordLength ? "text-emerald-700" : "text-gray-600"}`}>
                        Mínimo 8 caracteres
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasNumber ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-sm ${hasNumber ? "text-emerald-700" : "text-gray-600"}`}>
                        Al menos un número
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasSpecialChar ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-sm ${hasSpecialChar ? "text-emerald-700" : "text-gray-600"}`}>
                        Al menos un carácter especial
                      </span>
                    </div>
                    {confirmPassword && (
                      <div className="flex items-center gap-2">
                        {passwordsMatch ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordsMatch ? "text-emerald-700" : "text-red-700"}`}>
                          Las contraseñas coinciden
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
                disabled={!isValidPassword}
              >
                Establecer Nueva Contraseña
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-emerald-700 mt-6">
          Una vez que establezcas tu nueva contraseña, podrás iniciar sesión con ella de inmediato.
        </p>
      </div>
    </div>
  );
}