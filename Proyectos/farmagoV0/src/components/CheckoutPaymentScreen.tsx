import { useState } from "react";
import { CreditCard, Plus, ChevronRight, ChevronLeft, AlertCircle, Lock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface PaymentMethod {
  id: number;
  type: string;
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: "Visa",
      lastFour: "4242",
      expiryDate: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      lastFour: "8888",
      expiryDate: "09/25",
      isDefault: false,
    },
  ]);

  const [selectedPaymentId, setSelectedPaymentId] = useState<number>(1);
  const [showAddNew, setShowAddNew] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [newPayment, setNewPayment] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const subtotal = orderTotal;
  const total = subtotal + deliveryFee;

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just simulate success (real implementation would call backend)
      const paymentSucceeds = Math.random() > 0.2;

      if (!paymentSucceeds) {
        setPaymentError("Error en el pago. Por favor, verifica los datos de tu tarjeta e inténtalo nuevamente.");
        setShowErrorDialog(true);
        setIsProcessing(false);
        return;
      }

      toast.success("Pago procesado exitosamente");
      onConfirmPayment(selectedPaymentId);
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentError("Error al procesar el pago. Intenta nuevamente.");
      setShowErrorDialog(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const validateNewPayment = () => {
    const errors: {[key: string]: string} = {};

    if (!newPayment.cardNumber.trim()) {
      errors.cardNumber = "El número de tarjeta es obligatorio";
    } else if (newPayment.cardNumber.replace(/\s/g, "").length !== 16) {
      errors.cardNumber = "El número de tarjeta debe tener 16 dígitos";
    }

    if (!newPayment.cardName.trim()) errors.cardName = "El nombre es obligatorio";
    
    if (!newPayment.expiryDate.trim()) {
      errors.expiryDate = "La fecha de vencimiento es obligatoria";
    } else if (!/^\d{2}\/\d{2}$/.test(newPayment.expiryDate)) {
      errors.expiryDate = "Formato inválido (MM/AA)";
    }

    if (!newPayment.cvv.trim()) {
      errors.cvv = "El CVV es obligatorio";
    } else if (newPayment.cvv.length !== 3) {
      errors.cvv = "El CVV debe tener 3 dígitos";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewPayment = () => {
    if (!validateNewPayment()) {
      return;
    }

    const cardType = newPayment.cardNumber.startsWith("4") ? "Visa" : "Mastercard";
    const lastFour = newPayment.cardNumber.slice(-4);

    const payment: PaymentMethod = {
      id: paymentMethods.length + 1,
      type: cardType,
      lastFour: lastFour,
      expiryDate: newPayment.expiryDate,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, payment]);
    setSelectedPaymentId(payment.id);
    setShowAddNew(false);
    setNewPayment({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" });
    setFormErrors({});
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(" ") : cleaned;
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Método de Pago</h2>
        <p className="text-emerald-50">Paso 2 de 2 - Confirma tu pedido y paga de forma segura</p>
      </div>

      {/* Progress Indicator */}
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
          {!showAddNew && (
            <Card className="border-2 border-emerald-100 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100 flex flex-row items-center justify-between">
                <CardTitle className="text-emerald-900">Selecciona un Método de Pago</CardTitle>
                <Button
                  onClick={() => setShowAddNew(true)}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Tarjeta
                </Button>
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
                            <CreditCard className="h-6 w-6 text-white" />
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
                            <p className="text-sm text-gray-700 mt-1">
                              Termina en {method.lastFour}, expira {method.expiryDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {showAddNew && (
            <Card className="border-2 border-emerald-100 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
                <CardTitle className="text-emerald-900">Agregar Nueva Tarjeta</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={newPayment.cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16));
                        setNewPayment({ ...newPayment, cardNumber: formatted });
                      }}
                      className={formErrors.cardNumber ? 'border-red-500' : 'border-emerald-200'}
                    />
                    {formErrors.cardNumber && <p className="text-sm text-red-600 mt-1">{formErrors.cardNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cardName">Nombre en la Tarjeta *</Label>
                    <Input
                      id="cardName"
                      placeholder="Juan Pérez"
                      value={newPayment.cardName}
                      onChange={(e) => setNewPayment({ ...newPayment, cardName: e.target.value })}
                      className={formErrors.cardName ? 'border-red-500' : 'border-emerald-200'}
                    />
                    {formErrors.cardName && <p className="text-sm text-red-600 mt-1">{formErrors.cardName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Vencimiento (MM/AA) *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="12/26"
                        value={newPayment.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                          }
                          setNewPayment({ ...newPayment, expiryDate: value });
                        }}
                        maxLength={5}
                        className={formErrors.expiryDate ? 'border-red-500' : 'border-emerald-200'}
                      />
                      {formErrors.expiryDate && <p className="text-sm text-red-600 mt-1">{formErrors.expiryDate}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={newPayment.cvv}
                        onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                        maxLength={3}
                        className={formErrors.cvv ? 'border-red-500' : 'border-emerald-200'}
                      />
                      {formErrors.cvv && <p className="text-sm text-red-600 mt-1">{formErrors.cvv}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddNew(false);
                        setNewPayment({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" });
                        setFormErrors({});
                      }}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveNewPayment}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      Guardar Tarjeta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 mb-4">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Lock className="h-4 w-4" />
                    <p className="text-xs font-medium">Pago seguro y encriptado</p>
                  </div>
                </div>
                
                {!showAddNew && (
                  <>
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg mb-3"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          Confirmar y Pagar
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onBack}
                      disabled={isProcessing}
                      className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Volver
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Error Dialog */}
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
