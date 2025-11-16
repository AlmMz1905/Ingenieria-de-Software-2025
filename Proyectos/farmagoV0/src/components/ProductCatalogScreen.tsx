import { useState, useEffect } from "react";
import { Search, ShoppingCart, Package, Info, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { ProductDetailScreen, Product } from "./ProductDetailScreen";
// ¡Importamos la 'interface' del otro archivo!
import { type MedicamentoConStock } from "./StockManagementScreen";

// --- (Props que nos pasa App.tsx) ---
interface ProductCatalogScreenProps {
  onNavigateToCart?: () => void;
  stockItems: MedicamentoConStock[];
  setStockItems: React.Dispatch<React.SetStateAction<MedicamentoConStock[]>>;
}

export function ProductCatalogScreen({
  onNavigateToCart,
  stockItems,
  setStockItems,
}: ProductCatalogScreenProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- (Lógica del useEffect, igual que antes) ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error("VITE_API_URL no está configurada");

        const response = await fetch(`${apiUrl}/medications/`);

        if (!response.ok) throw new Error("Error al conectar con el backend.");
        
        const dataApi = await response.json();
        
        const dataConStock = dataApi.map((med: any) => ({
          ...med,
          stock: undefined,
          precio: undefined,
          minStock: 20,
        }));
        
        setStockItems(dataConStock); 
      } catch (err: any) {
        setError(err.message || "Error desconocido");
        toast.error(err.message || "Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };

    if (stockItems.length === 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [stockItems, setStockItems]);

  // --- (Filtro, igual que antes) ---
  const filteredProducts = stockItems.filter(product =>
    (product.nombre_comercial && product.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.categoria && product.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddToCart = (product: MedicamentoConStock) => {
    if (!product.stock || product.stock === 0) {
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

  const handleProductDetail = (product: MedicamentoConStock) => {
    // --- ¡CAMBIO! Arreglé la URL de la imagen ---
    const productMaqueta: Product = {
      id: product.id_medicamento.toString(),
      name: product.nombre_comercial,
      price: product.precio || 0,
      image: 'https://placehold.co/400x300?text=Sin+Imagen', // <-- ¡ARREGLADO!
      stock: product.stock || 0,
      category: product.categoria,
      requiresPrescription: product.requiere_receta,
      description: product.presentacion,
      activeIngredient: product.principio_activo,
      presentation: product.presentacion,
      laboratory: product.laboratorio,
      availabilityStatus: (product.stock || 0) > 0 ? "full" : "out-of-stock",
    };
    setSelectedProduct(productMaqueta);
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

  // --- (Manejo de Carga y Errores, igual que antes) ---
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
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* (Header, igual que antes) */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        {/* ... */}
      </div>

      {/* (Search Bar, igual que antes) */}
      <Card className="border-2 border-emerald-100">
        {/* ... */}
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stock = product.stock;
          const precio = product.precio;
          const isOutOfStock = (stock === undefined) || stock === 0;
          const inCart = cartItems[product.id_medicamento] || 0;
          const name = product.nombre_comercial;
          const category = product.categoria;

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
                  {/* --- ¡CAMBIO! Arreglé la URL de la imagen --- */}
                  <img
                    src={'https://placehold.co/400x300?text=Sin+Imagen'} // <-- ¡ARREGLADO!
                    alt={name}
                    className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                  />
                  {/* (El resto de los Badges, igual que antes) */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                      <Badge className="bg-red-600 text-white text-sm px-4 py-2">
                        {stock === undefined ? "Consultar Stock" : "Sin Stock"}
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
                {/* (El resto del CardContent, igual que antes) */}
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
                    {precio !== undefined ? `$${precio.toFixed(2)}` : "Consultar"}
                  </span>
                  {!isOutOfStock && (
                    <span className="text-sm text-gray-500">
                      Stock: {stock}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                {/* (Los botones, igual que antes) */}
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
                      {stock === undefined ? "Consultar" : "Sin Stock"}
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

      {/* (El mensaje de "No se encontraron", igual que antes) */}
      {filteredProducts.length === 0 && (
        <Card className="border-2 border-emerald-100">
          {/* ... */}
        </Card>
      )}
    </div>
  );
}