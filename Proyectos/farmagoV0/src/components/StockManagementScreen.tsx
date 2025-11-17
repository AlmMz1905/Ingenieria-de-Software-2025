import { useState, useEffect } from "react";
import { Search, Package, AlertTriangle, Plus, Edit, Loader2, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

// Interface de la API (JSON que nos pasaste)
interface ApiMedicamento {
  id_medicamento: number; 
  nombre_comercial: string;
  principio_activo: string;
  requiere_receta: boolean;
  categoria: string;
  presentacion: string;
  laboratorio: string;
}

// Interface "decorada" para el frontend
// ¡CAMBIO! La "exportamos" para que App.tsx la vea
export interface MedicamentoConStock extends ApiMedicamento {
  stock?: number;
  precio?: number;
  minStock: number; 
}

// --- ¡CAMBIO! Definimos los Props que nos pasa App.tsx ---
interface StockScreenProps {
  stockItems: MedicamentoConStock[];
  setStockItems: React.Dispatch<React.SetStateAction<MedicamentoConStock[]>>;
}

export function StockManagementScreen({ stockItems, setStockItems }: StockScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<MedicamentoConStock | null>(null);
  const [newStock, setNewStock] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // --- ¡CAMBIO! Ya no usamos el estado local 'medications' ---
  // const [medications, setMedications] = useState<MedicamentoConStock[]>([]);
  
  // ¡Estos estados siguen siendo locales!
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error("VITE_API_URL no está configurada");

        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No estás autenticado. Por favor, reinicia sesión.");
        }

        const response = await fetch(`${apiUrl}/medications/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          }
        });
        
        if (response.status === 401 || response.status === 403) {
          throw new Error("Tu sesión expiró o no tenés permisos. Por favor, reinicia sesión.");
        }
        if (!response.ok) throw new Error("Error al conectar con el backend.");
        
        const dataApi: ApiMedicamento[] = await response.json();
        
        const dataConStock = dataApi.map(med => {
          // ¡Acá está la "magia" que pediste!
          // Generamos valores "aleatorios" para la precarga
          const stock = Math.floor(Math.random() * 80) + 5; // Stock entre 20 y 100
          const precio = parseFloat((Math.random() * 9000 + 1500).toFixed(2)); // Precio entre 500 y 2500
          return {
            ...med,
            stock: stock,
            precio: precio,
            minStock: 20, 
          };
        });
        
        // --- ¡CAMBIO! Guardamos en el estado "Padre" ---
        setStockItems(dataConStock); 
      } catch (err: any) {
        setError(err.message || "Error desconocido");
        toast.error(err.message || "Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };

    // --- ¡CAMBIO! Solo buscamos si el estado Padre está vacío ---
    if (stockItems.length === 0) {
      fetchProducts();
    } else {
      setLoading(false); // Ya los teníamos, no cargamos nada
    }
  }, []); // Dependemos del estado Padre

  // --- ¡CAMBIO! Filtramos el estado "Padre" ---
  const filteredMedications = stockItems.filter((med) =>
    (med.nombre_comercial && med.nombre_comercial.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (med.principio_activo && med.principio_activo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditStock = (item: MedicamentoConStock) => {
    setEditingItem(item);
    setNewStock(item.stock ? item.stock.toString() : "");
    setNewPrice(item.precio ? item.precio.toString() : "0");
  };

  const handleSaveStock = async () => {
    if (!editingItem) return;

    const stockNum = parseInt(newStock, 10);
    const priceNum = parseFloat(newPrice);

    if (isNaN(stockNum) || stockNum < 0) {
      toast.error("Por favor, ingresá un número de stock válido.");
      return;
    }
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Por favor, ingresá un precio válido.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Error: No estás autenticado. Por favor, reinicia sesión.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(
        `${apiUrl}/pharmacies/stock`, 
        {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({
            precio: priceNum,
            cantidad_disponible: stockNum,
            id_medicamento: editingItem.id_medicamento
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        if (response.status === 401 || response.status === 403) {
          throw new Error(errData.detail || "Error de autenticación. Reinicia sesión.");
        }
        throw new Error(errData.detail || `Error ${response.status}: El servidor no pudo actualizar el stock.`);
      }

      // --- ¡CAMBIO! (Arreglo del Toast) ---
      // Parseamos el JSON en vez de el texto
      const data = await response.json(); 

      // Actualizamos la lista "en vivo" en el estado "Padre"
      setStockItems(prevMeds => 
        prevMeds.map(med => 
          med.id_medicamento === editingItem.id_medicamento 
            ? { ...med, stock: stockNum, precio: priceNum } 
            : med
        )
      );

      // ¡Usamos el mensaje lindo de la API!
      toast.success(data.message || `Stock de ${editingItem.nombre_comercial} actualizado`);
      
      // --- ¡CAMBIO! (Arreglo del Modal) ---
      // ¡Esto ahora SÍ cierra el pop-up!
      setEditingItem(null);
      setNewStock("");
      setNewPrice("");

    } catch (err: any) {
      console.error("Error en handleSaveStock:", err);
      toast.error(err.message || "Error al guardar el stock.");
    }
  };


  if (loading) {
    return (
      <div className="flex-1 p-6 flex justify-center items-center h-screen">
        <div className="flex items-center gap-3 text-lg text-emerald-700">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando inventario...</span>
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
            <Button onClick={() => {
                if(error.includes("autenticado") || error.includes("sesión")) {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("userName");
                  window.location.reload();
                } else {
                  window.location.reload();
                }
              }} 
              className="mt-4"
            >
              {error.includes("autenticado") ? "Volver a Iniciar Sesión" : "Reintentar"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Gestión de Stock</h2>
        <p className="text-emerald-50">Administra el inventario de medicamentos de la farmacia</p>
      </div>

      {/* Search and Add */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por nombre comercial o principio activo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-emerald-200 focus:ring-emerald-500"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              <Plus className="h-5 w-5 mr-2" />
              Agregar Nuevo Medicamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            {/* (El pop-up "neuteado" sigue igual) */}
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Medicamento</DialogTitle>
              <DialogDescription className="text-yellow-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <AlertTriangle className="h-4 w-4 inline-block mr-2" />
                Función no disponible: El backend (API) no permite crear
                productos nuevos desde la app, solo actualizar el stock de 
                productos existentes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newMedName">Nombre del Medicamento</Label>
                <Input id="newMedName" placeholder="Ej: Aspirina 500mg" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newMedDetails">Detalles</Label>
                <Input id="newMedDetails" placeholder="Ej: Analgésico, 20 comprimidos" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newMedStock">Stock Inicial</Label>
                <Input id="newMedStock" type="number" placeholder="Ej: 50" disabled />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button className="bg-gray-400" disabled>
                Guardar (Deshabilitado)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inventory Table */}
      <Card className="border-2 border-emerald-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            Inventario de Medicamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMedications.map((med) => {
              const stock = med.stock;
              const precio = med.precio;
              const minStock = med.minStock;
              const lowStock = (stock !== undefined) && stock < minStock;
              
              return (
                <div
                  key={med.id_medicamento}
                  className={`p-4 rounded-xl border-2 ...`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* (Icono igual) */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{med.nombre_comercial}</h4>
                          {lowStock && (
                            <Badge className="bg-red-500 ...">Stock Bajo</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{med.presentacion}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {/* Stock Actual */}
                          <div>
                            <span className="text-xs text-gray-500">Stock Actual: </span>
                            {stock !== undefined ? (
                              <span
                                className={`font-semibold ${
                                  lowStock ? "text-red-600" : "text-emerald-600"
                                }`}
                              >
                                {stock} unidades
                              </span>
                            ) : (
                              <span className="font-semibold text-gray-500">
                                No definido
                              </span>
                            )}
                          </div>
                          {/* Precio */}
                          <div>
                            <span className="text-xs text-gray-500">Precio: </span>
                            {precio !== undefined ? (
                              <span className="font-semibold text-emerald-600">
                                ${precio.toFixed(2)}
                              </span>
                            ) : (
                              <span className="font-semibold text-gray-500">No definido</span>
                            )}
                          </div>
                          {/* Stock Mínimo */}
                          <div>
                            <span className="text-xs text-gray-500">Stock Mínimo: </span>
                            <span className="font-medium text-gray-700">{minStock} unidades</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* --- ¡CAMBIO! (Arreglo del Modal) --- */}
                    {/* ¡Convertimos el Dialog a "Controlado"! */}
                    <Dialog open={!!editingItem && editingItem.id_medicamento === med.id_medicamento} onOpenChange={(isOpen) => !isOpen && setEditingItem(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          onClick={() => handleEditStock(med)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Stock y Precio</DialogTitle>
                          <DialogDescription>
                            Actualiza la cantidad y precio para {editingItem?.nombre_comercial || "este medicamento"}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Input de Stock */}
                          <div className="space-y-2">
                            <Label htmlFor="stockQuantity">Nueva Cantidad de Stock</Label>
                            <Input
                              id="stockQuantity"
                              type="number"
                              value={newStock}
                              onChange={(e) => setNewStock(e.target.value)}
                              placeholder="Ingrese la nueva cantidad"
                            />
                          </div>
                          {/* Input de Precio */}
                          <div className="space-y-2">
                            <Label htmlFor="stockPrice">Nuevo Precio</Label>
                            <Input
                              id="stockPrice"
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                              placeholder="Ej: 500.50"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingItem(null)}>
                            Cancelar
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                            onClick={handleSaveStock}
                          >
                            Guardar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* (Alerta de stock bajo, igual que antes) */}
    </div>
  );
}