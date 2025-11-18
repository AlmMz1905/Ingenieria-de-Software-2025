import { useState } from "react";
import { CreditCard, ChevronRight, ChevronLeft, AlertCircle, DollarSign } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface PaymentMethod {
  id: number;
  type: string;
  lastFour?: string; 
  expiryDate?: string;
  isDefault: boolean;
  icon: React.ReactNode; 
}

// --- ¡CAMBIO! ¡Aceptamos los props nuevos de IVA! ---
interface CheckoutPaymentScreenProps {
  onConfirmPayment: (paymentMethodId: number) => void;
  onBack: () => void;
  orderTotal: number; // ¡Este ahora es el TOTAL (IVA Inc.)!
  deliveryFee: number;
  subtotal: number; // ¡Este es el NETO (Sin IVA)!
  iva: number; // ¡Este es el IVA!
}
// --- FIN DEL CAMBIO ---

export function CheckoutPaymentScreen({ 
  onConfirmPayment, 
  onBack, 
  orderTotal, 
  deliveryFee,
  subtotal, // ¡Nuevo!
  iva,      // ¡Nuevo!
}: CheckoutPaymentScreenProps) {
  
  // (Lista de Pagos con "Efectivo", igual que antes)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: "Visa",
      lastFour: "4242",
      expiryDate: "12/26",
      isDefault: true,
      icon: <CreditCard className="h-6 w-6 text-white" />
    },
    {
      id: 2,
      type: "Mastercard",
      lastFour: "8888",
      expiryDate: "09/25",
      isDefault: false,
      icon: <CreditCard className="h-6 w-6 text-white" />
    },
    {
      id: 3,
      type: "Efectivo",
      isDefault: false,
      icon: <DollarSign className="h-6 w-6 text-white" />
    },
  ]);

  const [selectedPaymentId, setSelectedPaymentId] = useState<number>(1);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  
  // --- ¡CAMBIO! ¡Usamos el 'orderTotal' (que ya es el total)! ---
  const total = orderTotal + deliveryFee; 
  // --- FIN DEL CAMBIO ---

  const handleConfirmPayment = () => {
    const paymentSucceeds = true; 

    if (!paymentSucceeds) {
      setPaymentError("Error en el pago. Por favor, verifica los datos e inténtalo nuevamente.");
      setShowErrorDialog(true);
      return;
    }

    onConfirmPayment(selectedPaymentId);
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* (Header, igual que antes) */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Método de Pago</h2>
        <p className="text-emerald-50">Paso 2 de 2 - Confirma tu pedido y paga de forma segura</p>
      </div>

      {/* (Progress Indicator, igual que antes) */}
      <div className="flex items-center gap-4">
        {/* ... */}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Payment Methods Column */}
        <div className="col-span-2 space-y-6">
          {/* (Card de Métodos de Pago, igual que antes, sin "Nueva Tarjeta") */}
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100 flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-900">Selecciona un Método de Pago</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={selectedPaymentId.toString()} onValueChange={(val) => setSelectedPaymentId(parseInt(val))}>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 rounded-xl border-2 ...`}
                      onClick={() => setSelectedPaymentId(method.id)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={method.id.toString()} id={`payment-${method.id}`} />
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 ...">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-emerald-900">{method.type}</h4>
                            {method.isDefault && (
                              <span className="text-xs ...">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          {method.type !== "Efectivo" && (
                            <p className="text-sm text-gray-700 mt-1">
                              Termina en {method.lastFour}, expira {method.expiryDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Column */}
        <div className="col-span-1">
          <Card className="border-2 border-emerald-100 shadow-lg sticky top-6">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
              <CardTitle className="text-emerald-900">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              {/* --- ¡¡¡CAMBIO!!! ¡Ahora mostramos el IVA! --- */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal (Neto):</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>IVA (21%):</span>
                  <span className="font-medium">${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envío:</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>
                <hr className="border-emerald-200" />
                <div className="flex justify-between font-semibold text-xl text-emerald-900">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              {/* --- FIN DEL CAMBIO --- */}


              <div className="pt-4">
                {/* (Botones, igual que antes, sin "Pago Seguro") */}
                <Button
                  onClick={handleConfirmPayment}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg mb-3"
                  size="lg"
                >
                  Confirmar y Pagar
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* (Payment Error Dialog, igual que antes) */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        {/* ... */}
      </AlertDialog>
    </div>
  );
}