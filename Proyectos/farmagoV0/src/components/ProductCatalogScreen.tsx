import { useState } from "react";
import { Search, ShoppingCart, Package, Info } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import { ProductDetailScreen, Product } from "./ProductDetailScreen";

interface ProductCatalogScreenProps {
  onNavigateToCart?: () => void;
}

export function ProductCatalogScreen({ onNavigateToCart }: ProductCatalogScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: "P001",
      name: "Ibuprofeno 400mg",
      price: 350.00,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
      stock: 50,
      category: "Analgésicos",
      requiresPrescription: false,
      description: "Analgésico y antiinflamatorio de uso común para dolor leve a moderado",
      activeIngredient: "Ibuprofeno",
      presentation: "Comprimidos x 30",
      laboratory: "Bayer",
      availabilityStatus: "full",
    },
    {
      id: "P002",
      name: "Paracetamol 1g",
      price: 280.00,
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
      stock: 0,
      category: "Analgésicos",
      requiresPrescription: false,
      description: "Analgésico y antipirético para el tratamiento del dolor y la fiebre",
      activeIngredient: "Paracetamol",
      presentation: "Comprimidos x 20",
      laboratory: "Roemmers",
      availabilityStatus: "out-of-stock",
      estimatedRestockDays: 5,
      similarProducts: ["P001", "P005"],
    },
    {
      id: "P003",
      name: "Amoxicilina 500mg",
      price: 890.00,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
      stock: 30,
      category: "Antibióticos",
      requiresPrescription: true,
      description: "Antibiótico de amplio espectro para infecciones bacterianas",
      activeIngredient: "Amoxicilina",
      presentation: "Cápsulas x 16",
      laboratory: "Bagó",
      availabilityStatus: "full",
    },
    {
      id: "P004",
      name: "Alcohol en Gel 500ml",
      price: 450.00,
      image: "https://images.unsplash.com/photo-1584744982551-1234e1234e1234?w=400",
      stock: 100,
      category: "Higiene",
      requiresPrescription: false,
      description: "Antiséptico de manos con 70% de alcohol",
      activeIngredient: "Alcohol Etílico 70%",
      presentation: "Frasco x 500ml",
      laboratory: "La Selva",
      availabilityStatus: "full",
    },
    {
      id: "P005",
      name: "Omeprazol 20mg",
      price: 520.00,
      image: "https://images.unsplash.com/photo-1550572017-4870e1c4d6eb?w=400",
      stock: 45,
      category: "Digestivos",
      requiresPrescription: false,
      description: "Inhibidor de la bomba de protones para acidez estomacal",
      activeIngredient: "Omeprazol",
      presentation: "Cápsulas x 28",
      laboratory: "Bago",
      availabilityStatus: "full",
    },
    {
      id: "P006",
      name: "Vacuna contra la Gripe",
      price: 3800.00,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
      stock: 8,
      category: "Vacunas",
      requiresPrescription: false,
      description: "Vacuna antigripal tetravalente para inmunización anual",
      activeIngredient: "Vacuna Antigripal Inactivada",
      presentation: "Jeringa prellenada",
      laboratory: "Sanofi",
      availabilityStatus: "pickup-only",
    },
    {
      id: "P007",
      name: "Atorvastatina 20mg",
      price: 1250.00,
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
      stock: 0,
      category: "Cardiovascular",
      requiresPrescription: true,
      description: "Hipolipemiante para control de colesterol",
      activeIngredient: "Atorvastatina",
      presentation: "Comprimidos x 30",
      laboratory: "Pfizer",
      availabilityStatus: "out-of-stock",
      estimatedRestockDays: 7,
      similarProducts: ["P003"],
    },
    {
      id: "P008",
      name: "Vitamina C 1000mg",
      price: 680.00,
      image: "https://images.unsplash.com/photo-1550572017-4870e1c4d6eb?w=400",
      stock: 75,
      category: "Suplementos",
      requiresPrescription: false,
      description: "Suplemento vitamínico para reforzar el sistema inmune",
      activeIngredient: "Ácido Ascórbico",
      presentation: "Comprimidos efervescentes x 30",
      laboratory: "Redoxon",
      availabilityStatus: "full",
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Si hay un producto seleccionado, mostrar el detalle
  if (selectedProduct) {
    return (
      <ProductDetailScreen
        product={selectedProduct}
        onBack={handleBackToCatalog}
        onAddToCart={handleAddToCartFromDetail}
      />
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
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`}
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
                    {product.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg mb-2 text-emerald-900">
                  {product.name}
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {!isOutOfStock && (
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
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