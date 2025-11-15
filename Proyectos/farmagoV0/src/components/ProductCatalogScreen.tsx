import { useState, useEffect } from "react";
import { Search, ShoppingCart, Package, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface Product {
  id_medicamento: string;
  nombre_comercial: string;
  precio?: number;
  image?: string;
  stock?: number;
  categoria: string;
  requiere_receta: boolean;
  principio_activo: string;
}

interface ProductCatalogScreenProps {
  onNavigateToCart?: () => void;
}

export function ProductCatalogScreen({ onNavigateToCart }: ProductCatalogScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [medications, setMedications] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/medications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        
        // Transform backend data to match component expectations
        const transformedData = data.map((med: any) => ({
          id_medicamento: med.id_medicamento.toString(),
          nombre_comercial: med.nombre_comercial,
          categoria: med.categoria,
          requiere_receta: med.requiere_receta,
          principio_activo: med.principio_activo,
          // Mock data for display (backend doesn't provide these yet)
          precio: Math.floor(Math.random() * 1000) + 100,
          stock: Math.floor(Math.random() * 100) + 10,
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
        }));
        
        setMedications(transformedData);
      } catch (error) {
        console.error("Error fetching medications:", error);
        toast.error("Error cargando medicamentos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, []);

  const filteredProducts = medications.filter(product =>
    product.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error("Este producto no tiene stock disponible.");
      return;
    }

    setCartItems(prev => ({
      ...prev,
      [product.id_medicamento]: (prev[product.id_medicamento] || 0) + 1
    }));

    toast.success(`${product.nombre_comercial} agregado al carrito.`);
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-gray-600">Cargando medicamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold mb-2">Catálogo de Productos</h2>
            <p className="text-emerald-50">Encuentra tus medicamentos y productos de salud</p>
          </div>
          {getTotalCartItems() > 0 && onNavigateToCart && (
            <Button
              onClick={onNavigateToCart}
              className="bg-white text-emerald-600 hover:bg-emerald-50"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ver Carrito ({getTotalCartItems()})
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border-2 border-emerald-100">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar productos por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-emerald-200 focus:ring-emerald-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const isOutOfStock = product.stock === 0;
          const inCart = cartItems[product.id_medicamento] || 0;

          return (
            <Card 
              key={product.id_medicamento} 
              className={`border-2 border-emerald-100 shadow-lg overflow-hidden transition-all ${
                isOutOfStock 
                  ? 'opacity-60' 
                  : 'hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              <CardHeader className="p-0 relative">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.nombre_comercial}
                    className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                      <Badge className="bg-red-600 text-white text-sm px-4 py-2">
                        Sin Stock
                      </Badge>
                    </div>
                  )}
                  {product.requiere_receta && !isOutOfStock && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                      Requiere Receta
                    </Badge>
                  )}
                  {inCart > 0 && (
                    <Badge className="absolute top-2 left-2 bg-emerald-600 text-white">
                      {inCart} en carrito
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-300">
                    {product.categoria}
                  </Badge>
                </div>
                <CardTitle className="text-lg mb-2 text-emerald-900">
                  {product.nombre_comercial}
                </CardTitle>
                <p className="text-sm text-gray-600 mb-2">{product.principio_activo}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">
                    ${product.precio?.toFixed(2)}
                  </span>
                  {!isOutOfStock && (
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={isOutOfStock}
                  className={`w-full ${
                    isOutOfStock
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                  }`}
                >
                  {isOutOfStock ? (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Sin Stock
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Agregar al Carrito
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="border-2 border-emerald-100">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
