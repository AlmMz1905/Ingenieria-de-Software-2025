import { useState } from "react";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Truck,
  Store,
  AlertCircle,
  CheckCircle,
  Info,
  Bell,
  Heart,
  Pill
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  requiresPrescription: boolean;
  description: string;
  activeIngredient: string;
  presentation: string;
  laboratory: string;
  // Nuevos campos para disponibilidad
  availabilityStatus: "full" | "pickup-only" | "out-of-stock";
  estimatedRestockDays?: number;
  similarProducts?: string[];
}

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onAddToCart?: (product: Product, deliveryMethod: "delivery" | "pickup") => void;
}

export function ProductDetailScreen({ product, onBack, onAddToCart }: ProductDetailScreenProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");

  const handleAddToCart = () => {
    if (product.availabilityStatus === "out-of-stock") {
      toast.error("Este producto no está disponible actualmente");
      return;
    }

    if (product.availabilityStatus === "pickup-only" && selectedDeliveryMethod === "delivery") {
      toast.error("Este producto solo está disponible para retiro en mostrador");
      return;
    }

    if (onAddToCart) {
      onAddToCart(product, selectedDeliveryMethod);
    }
    
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleRequestNotification = () => {
    if (!notificationEmail) {
      toast.error("Por favor ingresa tu email");
      return;
    }

    toast.success(`Te notificaremos cuando ${product.name} esté disponible`);
    setShowNotificationDialog(false);
    setNotificationEmail("");
  };

  const getAvailabilityDisplay = () => {
    switch (product.availabilityStatus) {
      case "full":
        return {
          badge: (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-base">
              <CheckCircle className="h-5 w-5 mr-2" />
              ¡En Stock!
            </Badge>
          ),
          message: (
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-300">
              <p className="font-semibold text-emerald-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Disponible para retiro inmediato y envío a domicilio
              </p>
              <p className="text-sm text-emerald-700 mt-1">
                Este producto está en stock y listo para ser enviado o retirado en nuestra farmacia.
              </p>
            </div>
          ),
          canPurchase: true,
          allowDelivery: true,
          allowPickup: true,
        };
      
      case "pickup-only":
        return {
          badge: (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 text-base">
              <AlertCircle className="h-5 w-5 mr-2" />
              Stock Limitado
            </Badge>
          ),
          message: (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-300">
              <p className="font-semibold text-amber-900 flex items-center gap-2">
                <Store className="h-5 w-5" />
                Solo disponible para Retiro en Mostrador
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Este producto tiene stock limitado o requiere manejo especial. Debe ser retirado en nuestra farmacia.
              </p>
            </div>
          ),
          canPurchase: true,
          allowDelivery: false,
          allowPickup: true,
        };
      
      case "out-of-stock":
        return {
          badge: (
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-base">
              <AlertCircle className="h-5 w-5 mr-2" />
              Temporalmente Sin Stock
            </Badge>
          ),
          message: (
            <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border-2 border-red-300">
              <p className="font-semibold text-red-900 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Producto Agotado
              </p>
              <p className="text-sm text-red-700 mt-1">
                Este producto está temporalmente agotado. 
                {product.estimatedRestockDays && (
                  <> Reposición estimada en {product.estimatedRestockDays} días hábiles.</>
                )}
              </p>
            </div>
          ),
          canPurchase: false,
          allowDelivery: false,
          allowPickup: false,
        };
    }
  };

  const availability = getAvailabilityDisplay();

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="outline"
        className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Catálogo
      </Button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <Card className="border-2 border-emerald-100 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-96 bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
              {product.requiresPrescription && (
                <Badge className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-2">
                  <Pill className="h-4 w-4 mr-1" />
                  Requiere Receta Médica
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Details */}
        <div className="space-y-4">
          {/* Product Info Card */}
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-300 mb-2">
                    {product.category}
                  </Badge>
                  <CardTitle className="text-2xl text-emerald-900">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {product.description}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-emerald-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-gray-500">por unidad</span>
              </div>

              <Separator />

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Principio Activo:</p>
                  <p className="font-medium">{product.activeIngredient}</p>
                </div>
                <div>
                  <p className="text-gray-600">Presentación:</p>
                  <p className="font-medium">{product.presentation}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Laboratorio:</p>
                  <p className="font-medium">{product.laboratory}</p>
                </div>
              </div>

              <Separator />

              {/* Availability Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-gray-900">Disponibilidad:</span>
                </div>
                {availability.badge}
                {availability.message}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Card */}
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Opciones de Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availability.canPurchase ? (
                <>
                  {/* Quantity Selector */}
                  <div>
                    <Label htmlFor="quantity">Cantidad</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="border-emerald-300"
                      >
                        -
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="text-center border-emerald-300"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="border-emerald-300"
                      >
                        +
                      </Button>
                    </div>
                    {product.availabilityStatus !== "out-of-stock" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Disponibles: {product.stock} unidades
                      </p>
                    )}
                  </div>

                  {/* Delivery Method Selection */}
                  <div className="space-y-2">
                    <Label>Método de Entrega</Label>
                    
                    {availability.allowDelivery && (
                      <Button
                        variant={selectedDeliveryMethod === "delivery" ? "default" : "outline"}
                        className={`w-full justify-start ${
                          selectedDeliveryMethod === "delivery"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                            : "border-emerald-300 hover:bg-emerald-50"
                        }`}
                        onClick={() => setSelectedDeliveryMethod("delivery")}
                      >
                        <Truck className="h-5 w-5 mr-2" />
                        <div className="text-left">
                          <p className="font-semibold">Envío a Domicilio</p>
                          <p className="text-xs opacity-80">Recíbelo en 24-48hs</p>
                        </div>
                      </Button>
                    )}

                    {availability.allowPickup && (
                      <Button
                        variant={selectedDeliveryMethod === "pickup" ? "default" : "outline"}
                        className={`w-full justify-start ${
                          selectedDeliveryMethod === "pickup"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                            : "border-emerald-300 hover:bg-emerald-50"
                        }`}
                        onClick={() => setSelectedDeliveryMethod("pickup")}
                      >
                        <Store className="h-5 w-5 mr-2" />
                        <div className="text-left">
                          <p className="font-semibold">Retiro en Mostrador</p>
                          <p className="text-xs opacity-80">Listo en 2 horas</p>
                        </div>
                      </Button>
                    )}

                    {!availability.allowDelivery && availability.allowPickup && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-xs text-amber-800">
                          <Info className="h-4 w-4 inline mr-1" />
                          Este producto solo puede retirarse en mostrador
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Agregar al Carrito
                  </Button>
                </>
              ) : (
                <>
                  {/* Out of Stock Actions */}
                  <div className="space-y-3">
                    <Button
                      onClick={() => setShowNotificationDialog(true)}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
                    >
                      <Bell className="h-5 w-5 mr-2" />
                      Solicitar Notificación de Reposición
                    </Button>

                    {product.similarProducts && product.similarProducts.length > 0 && (
                      <Button
                        variant="outline"
                        className="w-full h-12 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        <Package className="h-5 w-5 mr-2" />
                        Ver Medicamentos Similares
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Prescription Warning */}
          {product.requiresPrescription && (
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-700 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900">Requiere Receta Médica</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Deberás presentar o subir una receta médica válida para completar la compra de este medicamento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-900">
              <Bell className="h-6 w-6" />
              Solicitar Notificación
            </DialogTitle>
            <DialogDescription>
              Te enviaremos un email cuando {product.name} vuelva a estar disponible
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="notificationEmail">Email</Label>
              <Input
                id="notificationEmail"
                type="email"
                placeholder="tu@email.com"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="border-emerald-300 focus:ring-emerald-500"
              />
            </div>

            {product.estimatedRestockDays && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <Info className="h-4 w-4 inline mr-1" />
                  Reposición estimada en {product.estimatedRestockDays} días hábiles
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNotificationDialog(false)}
              className="border-emerald-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRequestNotification}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Bell className="h-4 w-4 mr-2" />
              Solicitar Notificación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
