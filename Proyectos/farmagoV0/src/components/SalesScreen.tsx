import { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { type CartItem } from "../App"; 
import { toast } from "sonner";

// --- Interfaces ---
interface Direccion {
  id_direccion: number;
  alias: string;
  calle_numero: string;
  ciudad: string;
  provincia: string;
  es_predeterminada: boolean;
}

interface ClienteResponse {
  direcciones: Direccion[];
}

// --- Props ---
interface SalesScreenProps {
  onProceedToCheckout?: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function SalesScreen({ 
  onProceedToCheckout, 
  cart, 
  setCart  
}: SalesScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- Estados para el perfil ---
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasAddresses, setHasAddresses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cartItems = cart;

  // --- Cálculos ---
  const subtotal = cartItems.reduce((sum, item) => sum + (item.quantity * (item.precio || 0)), 0);
  const discount = 0;
  const tax = subtotal * 0.21;
  const total = subtotal - discount + tax;

  // --- useEffect para verificar las direcciones ---
  useEffect(() => {
    const checkUserAddresses = async () => {
      setLoadingProfile(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!token || !apiUrl) {
        setError("No estás autenticado.");
        setLoadingProfile(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/users/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error("No se pudo cargar tu perfil.");
        }
        
        const data: ClienteResponse = await response.json();
        
        if (data.direcciones && data.direcciones.length > 0) {
          setHasAddresses(true);
        } else {
          setHasAddresses(false);
        }
        
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    checkUserAddresses();
  }, []);

  // --- Funciones del Carrito ---
  const updateQuantity = (id: number, change: number) => {
    setCart(items => 
      items.map(item => 
        item.id_medicamento === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0) 
    );
  };

  const removeItem = (id: number) => {
    setCart(items => items.filter(item => item.id_medicamento !== id));
  };
  
  const filteredCartItems = cartItems.filter(item =>
    item.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // --- Render ---
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Carrito de Compras</h2>
        <p className="text-emerald-50">Revisa y gestiona tus productos</p>
      </div>

      {/* Search Bar */}
      <Card className="border-2 border-emerald-100">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar productos en el carrito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-emerald-200 focus:ring-emerald-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* ¡¡¡ESTA ES LA PARTE QUE FALTABA!!! */}
        <div className="col-span-2">
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
              <CardTitle className="text-emerald-900">Productos en el Carrito</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Tu carrito de compras está vacío.</p>
                  <p className="text-sm text-gray-400">Agregá productos desde el Catálogo.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-emerald-900">Producto</TableHead>
                      <TableHead className="text-center text-emerald-900">Cantidad</TableHead>
                      <TableHead className="text-right text-emerald-900">Precio</TableHead>
                      <TableHead className="text-right text-emerald-900">Subtotal</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCartItems.map((item) => (
                      <TableRow key={item.id_medicamento}>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">{item.nombre_comercial}</div>
                            <div className="text-sm text-gray-500">ID: {item.id_medicamento}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-emerald-300 hover:bg-emerald-100"
                              onClick={() => updateQuantity(item.id_medicamento, -1)}
                            >
                              <Minus className="h-3 w-3 text-emerald-600" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 border-emerald-300 hover:bg-emerald-100"
                              onClick={() => updateQuantity(item.id_medicamento, 1)}
                            >
                              <Plus className="h-3 w-3 text-emerald-600" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">${(item.precio || 0).toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-700">
                          ${(item.quantity * (item.precio || 0)).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                            onClick={() => removeItem(item.id_medicamento)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        {/* ¡¡¡FIN DE LA PARTE QUE FALTABA!!! */}


        {/* Invoice Summary */}
        <div>
          <Card className="border-2 border-emerald-100 shadow-lg sticky top-6">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
              <CardTitle className="text-emerald-900">Resumen de Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Descuento:</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>IVA (21%):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <hr className="border-emerald-200" />
                <div className="flex justify-between font-semibold text-xl text-emerald-900">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {loadingProfile && (
                  <div className="flex items-center justify-center gap-2 text-emerald-600 p-3 bg-emerald-50 rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Verificando direcciones...</span>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center justify-center gap-2 text-red-600 p-3 bg-red-50 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {!loadingProfile && !hasAddresses && !error && (
                  <div className="flex items-start gap-3 text-yellow-800 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                    <AlertCircle className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold">¡Falta un paso!</p>
                      <p>Para comprar, debés agregar al menos una dirección en tu perfil.
                         Andá a <span className="font-bold">Configuración de perfil {'>'} Direcciones</span>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg" 
                  size="lg" 
                  onClick={onProceedToCheckout}
                  disabled={cartItems.length === 0 || loadingProfile || !hasAddresses}
                >
                  Finalizar Compra
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setCart([])}
                  disabled={cartItems.length === 0}
                >
                  Cancelar Pedido
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}