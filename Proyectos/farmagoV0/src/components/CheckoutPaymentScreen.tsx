import { useState } from "react";
// --- ¡CAMBIO! ¡Agregué 'DollarSign' para el efectivo! ---
import { CreditCard, ChevronRight, ChevronLeft, AlertCircle, Lock, DollarSign } from "lucide-react"; 
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
  lastFour?: string; // ¡CAMBIO! (Lo hice opcional para "Efectivo")
  expiryDate?: string; // ¡CAMBIO! (Lo hice opcional para "Efectivo")
  isDefault: boolean;
  icon: React.ReactNode; // ¡CAMBIO! (Para meter el ícono)
}

interface CheckoutPaymentScreenProps {
  onConfirmPayment: (paymentMethodId: number) => void;
  onBack: () => void;
  orderTotal: number;
  deliveryFee: number;
}

export function CheckoutPaymentScreen({ 
  onConfirmPayment, 
  onBack, 
  orderTotal, 
  deliveryFee 
}: CheckoutPaymentScreenProps) {
  
  // --- ¡CAMBIO! ¡Agregamos "Efectivo" a la lista! ---
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
    // ¡¡¡NUEVO!!!
    {
      id: 3,
      type: "Efectivo",
      isDefault: false,
      icon: <DollarSign className="h-6 w-6 text-white" />
    },
  ]);
  // --- FIN DEL CAMBIO ---

  const [selectedPaymentId, setSelectedPaymentId] = useState<number>(1);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  
  // --- ¡CAMBIO! ¡Volamos todo el 'useState' de 'showAddNew' y 'newPayment'! ---
  // (Ya no necesitamos agregar tarjetas nuevas)

  const subtotal = orderTotal;
  const total = subtotal + deliveryFee;

  const handleConfirmPayment = () => {
    // Simulamos el pago (ya no falla, ¡que ande!)
    const paymentSucceeds = true; 

    if (!paymentSucceeds) {
      setPaymentError("Error en el pago. Por favor, verifica los datos e inténtalo nuevamente.");
      setShowErrorDialog(true);
      return;
    }

    onConfirmPayment(selectedPaymentId);
  };

  // --- ¡CAMBIO! ¡Volamos las funciones de 'validateNewPayment', ---
  // 'handleSaveNewPayment' y 'formatCardNumber' (ya no sirven) ---

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* (Header, igual que antes) */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Método de Pago</h2>
        <p className="text-emerald-50">Paso 2 de 2 - Confirma tu pedido y paga de forma segura</p>
      </div>

      {/* (Progress Indicator, igual que antes) */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
            ✓
          </div>
          <span className="text-emerald-700 font-medium">Dirección</span>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
            2
          </div>
          <span className="font-semibold text-emerald-900">Pago</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Payment Methods Column */}
        <div className="col-span-2 space-y-6">
          {/* --- ¡CAMBIO! ¡Volamos el 'showAddNew' y el formulario! --- */}
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100 flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-900">Selecciona un Método de Pago</CardTitle>
              {/* --- ¡Volamos el botón de Nueva Tarjeta! --- */}
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={selectedPaymentId.toString()} onValueChange={(val) => setSelectedPaymentId(parseInt(val))}>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedPaymentId === method.id
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md'
                          : 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                      onClick={() => setSelectedPaymentId(method.id)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={method.id.toString()} id={`payment-${method.id}`} />
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                          {/* --- ¡CAMBIO! Usamos el ícono dinámico --- */}
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-emerald-900">{method.type}</h4>
                            {method.isDefault && (
                              <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          {/* --- ¡CAMBIO! Mostramos esto solo si NO es efectivo --- */}
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
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
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

              <div className="pt-4">
                {/* --- ¡CAMBIO! ¡Volamos el 'div' del "Pago Seguro"! --- */}
                
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center">Error en el Pago</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {paymentError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowErrorDialog(false)}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              Intentar Nuevamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}