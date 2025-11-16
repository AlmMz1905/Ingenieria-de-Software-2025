import { useState, useEffect } from "react";
import { Search, ShoppingCart, Package, Info, Loader2 } from "lucide-react"; // <--- ¡CAMBIO! (Agregué Loader2)
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { ProductDetailScreen, Product } from "./ProductDetailScreen";

interface ProductCatalogScreenProps {
  onNavigateToCart?: () => void;
}

export function ProductCatalogScreen({ onNavigateToCart }: ProductCatalogScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          throw new Error("La variable VITE_API_URL no está configurada en .env.local");
        }

        // Esta barra al final es CLAVE, como vimos en el redirect 307 de tu terminal
        const response = await fetch(`${apiUrl}/medications/`); 
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo conectar al backend.`);
        }
        
        const data: Product[] = await response.json();
        setProducts(data); 
      } catch (err: any) {
        console.error("¡Se rompió todo al traer el catálogo!:", err);
        setError(err.message || "Error desconocido al cargar productos.");
        toast.error(err.message || "Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // --- ¡CAMBIO! (Filtro a prueba de balas) ---
  // Ahora chequea si .name y .category existen ANTES de usar .toLowerCase()
  const filteredProducts = products.filter(product => {
    const nameMatch = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || categoryMatch;
  });
  // --- FIN DEL CAMBIO ---


  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error("Este producto no tiene stock disponible.");
      return;
    }

    setCartItems(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));

    toast.success(`${product.name} agregado al carrito.`);
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  const handleProductDetail = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
  };

  const handleAddToCartFromDetail = (product: Product, deliveryMethod: "delivery" | "pickup") => {
    setCartItems(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }));
  };

  if (selectedProduct) {
    return (
      <ProductDetailScreen
        product={selectedProduct}
        onBack={handleBackToCatalog}
        onAddToCart={handleAddToCartFromDetail}
      />
    );
  }

  // --- ¡CAMBIO! (Mensaje de carga "sutil") ---
  if (loading) {
    return (
      <div className="flex-1 p-6 flex justify-center items-center h-screen">
        <div className="flex items-center gap-3 text-lg text-emerald-700">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando productos...</span>
        </div>
      </div>
    );
  }
  // --- FIN DEL CAMBIO ---

  if (error) {
    return (
      <div className="flex-1 p-6 text-center">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-12">
            <Info className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-bold text-xl">¡Ups! Algo salió mal</p>
            <p className="text-gray-600 mt-2">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
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
          // Chequeo si los campos que usamos existen, por las dudas
          const name = product.name || "Producto sin nombre";
          const category = product.category || "Sin categoría";
          const price = product.price || 0;
          const stock = product.stock || 0;
          
          const isOutOfStock = stock === 0;
          const inCart = cartItems[product.id] || 0;

          return (
            <Card 
              key={product.id} 
              className={`border-2 border-emerald-100 shadow-lg overflow-hidden transition-all ${
                isOutOfStock 
                  ? 'opacity-60' 
                  : 'hover:shadow-xl hover:scale-[1.02]'
              }`}
            >
              <CardHeader className="p-0 relative">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
                  <img
                    src={product.image} // ¡OJO! Esto puede fallar si la imagen no existe
                    alt={name}
                    className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                    // Agregamos un fallback por si la imagen se rompe
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Sin+Imagen')}
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                      <Badge className="bg-red-600 text-white text-sm px-4 py-2">
                        Sin Stock
                      </Badge>
                    </div>
                  )}
                  {product.requiresPrescription && !isOutOfStock && (
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
                    {category}
                  </Badge>
                </div>
                <CardTitle className="text-lg mb-2 text-emerald-900">
                  {name}
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">
                    ${price.toFixed(2)}
                  </span>
                  {!isOutOfStock && (
                    <span className="text-sm text-gray-500">
                      Stock: {stock}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <Button
                  onClick={() => handleProductDetail(product)}
                  variant="outline"
                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Ver Disponibilidad
                </Button>
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

      {filteredProducts.length === 0 && !loading && (
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