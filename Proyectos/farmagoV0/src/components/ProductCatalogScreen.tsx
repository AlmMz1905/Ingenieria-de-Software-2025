import { useState, useEffect } from "react"; // <-- ¡'useEffect' es clave!
import { Search, ShoppingCart, Package, Info, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { ProductDetailScreen, Product } from "./ProductDetailScreen";
import { type MedicamentoConStock, type CartItem } from "../App"; 

// --- (Props que nos pasa App.tsx) ---
interface ProductCatalogScreenProps {
  onNavigateToCart?: () => void;
  stockItems: MedicamentoConStock[];
  setStockItems: React.Dispatch<React.SetStateAction<MedicamentoConStock[]>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function ProductCatalogScreen({
  onNavigateToCart,
  stockItems,
  setStockItems, // <--- ¡OJO! ¡Ya no lo usamos, pero lo dejamos!
  cart, 
  setCart, 
}: ProductCatalogScreenProps) {
  
  // --- ¡CAMBIO TOTAL! ---
  // ¡No más 'loading', 'error' o 'useEffect'!
  // ¡Este componente ahora es "bobo"!
  // Solo "dibuja" el 'stockItems' que le da el Padre.
  // --- FIN DEL CAMBIO ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  interface ApiMedicamento {
    id_medicamento: number; 
    nombre_comercial: string;
    principio_activo: string;
    requiere_receta: boolean;
    categoria: string;
    presentacion: string;
    laboratorio: string;
  }
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error("VITE_API_URL no está configurada");

        const response = await fetch(`${apiUrl}/medications/`);
        
        if (!response.ok) throw new Error("Error al conectar con el backend.");
        
        const dataApi: ApiMedicamento[] = await response.json();
        
        const dataConStock = dataApi.map(med => {
          const stock = Math.floor(Math.random() * 80) + 20;
          const precio = parseFloat((Math.random() * 2000 + 500).toFixed(2));
          return { ...med, stock: stock, precio: precio, minStock: 20 };
        });
        
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
  }, []); // <-- El '[]' es clave
  
  // ¡Filtramos el 'stockItems' del Padre!
  const filteredProducts = stockItems.filter(product =>
    (product.nombre_comercial && product.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.categoria && product.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- (handleAddToCart, igual que antes) ---
  const handleAddToCart = (product: MedicamentoConStock) => {
    if (!product.stock || product.stock === 0) {
      toast.error("Este producto no tiene stock disponible.");
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id_medicamento === product.id_medicamento);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > (product.stock || 0)) {
          toast.error("No hay más stock disponible.");
          return prevCart;
        }
        
        return prevCart.map(item =>
          item.id_medicamento === product.id_medicamento
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    toast.success(`${product.nombre_comercial} agregado al carrito.`);
  };

  // --- (getTotalCartItems, igual que antes) ---
  const getTotalCartItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // --- (handleProductDetail, igual que antes) ---
  const handleProductDetail = (product: MedicamentoConStock) => {
    const productMaqueta: Product = {
      id: product.id_medicamento.toString(),
      name: product.nombre_comercial,
      price: product.precio || 0,
      image: 'https://placehold.co/400x300?text=Sin+Imagen', 
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
    const realProduct = stockItems.find(p => p.id_medicamento.toString() === product.id);
    if (realProduct) {
      handleAddToCart(realProduct);
    } else {
      toast.error("Error al agregar el producto.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 ... flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-lg text-emerald-700">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando inventario...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6 ... flex-1 flex items-center justify-center">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-12 text-center">
            <Info className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 ...">¡Ups! Algo salió mal</p>
            <p className="text-gray-600 mt-2">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  // --- (Manejo de 'selectedProduct', igual que antes) ---
  if (selectedProduct) {
    return (
      <ProductDetailScreen
        product={selectedProduct}
        onBack={handleBackToCatalog}
        onAddToCart={handleAddToCartFromDetail}
      />
    );
  }
  
  // --- ¡CAMBIO! ¡Volamos el 'loading' y 'error' de acá! ---

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* (Header, igual que antes) */}
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

      {/* (Search Bar, igual que antes) */}
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
        {/* --- ¡CAMBIO! ¡Ahora lee del 'stockItems' del Padre! --- */}
        {filteredProducts.map((product) => {
          const stock = product.stock;
          const precio = product.precio;
          const isOutOfStock = (stock === undefined) || stock === 0;
          const itemInCart = cart.find(item => item.id_medicamento === product.id_medicamento);
          const inCart = itemInCart ? itemInCart.quantity : 0;
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
                  <img
                    src={'https://placehold.co/400x300?text=Sin+Imagen'} 
                    alt={name}
                    className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
                  />
                  {/* (Badges, igual que antes) */}
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
                {/* (CardContent, igual que antes) */}
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
                {/* (Botones, igual que antes) */}
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

      {/* (Mensaje "No se encontraron", igual que antes) */}
      {(filteredProducts.length === 0 && stockItems.length > 0) && (
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