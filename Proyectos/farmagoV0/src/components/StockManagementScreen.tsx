import { useState } from "react";
import { Search, Package, AlertTriangle, Plus, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function StockManagementScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newStock, setNewStock] = useState("");

  const medications = [
    {
      id: 1,
      name: "Ibuprofeno 400mg",
      details: "Antiinflamatorio, 30 comprimidos",
      stock: 15,
      lowStock: true,
      minStock: 20,
    },
    {
      id: 2,
      name: "Paracetamol 500mg",
      details: "Analgésico, 20 comprimidos",
      stock: 150,
      lowStock: false,
      minStock: 50,
    },
    {
      id: 3,
      name: "Amoxicilina 500mg",
      details: "Antibiótico, 20 cápsulas",
      stock: 18,
      lowStock: true,
      minStock: 30,
    },
    {
      id: 4,
      name: "Omeprazol 20mg",
      details: "Protector gástrico, 30 cápsulas",
      stock: 80,
      lowStock: false,
      minStock: 40,
    },
    {
      id: 5,
      name: "Atorvastatina 20mg",
      details: "Hipocolesterolemiante, 30 comprimidos",
      stock: 12,
      lowStock: true,
      minStock: 25,
    },
    {
      id: 6,
      name: "Losartán 50mg",
      details: "Antihipertensivo, 30 comprimidos",
      stock: 95,
      lowStock: false,
      minStock: 35,
    },
    {
      id: 7,
      name: "Metformina 850mg",
      details: "Antidiabético, 60 comprimidos",
      stock: 110,
      lowStock: false,
      minStock: 50,
    },
  ];

  const filteredMedications = medications.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditStock = (item: any) => {
    setEditingItem(item);
    setNewStock(item.stock.toString());
  };

  const handleSaveStock = () => {
    alert(`Stock actualizado para ${editingItem.name}: ${newStock} unidades`);
    setEditingItem(null);
    setNewStock("");
  };

  return (
    <div className="flex-1 p-6 space-y-6">
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
            placeholder="Buscar medicamento..."
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
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Medicamento</DialogTitle>
              <DialogDescription>
                Ingresa los detalles del nuevo medicamento para agregarlo al inventario.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newMedName">Nombre del Medicamento</Label>
                <Input id="newMedName" placeholder="Ej: Aspirina 500mg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newMedDetails">Detalles</Label>
                <Input id="newMedDetails" placeholder="Ej: Analgésico, 20 comprimidos" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newMedStock">Stock Inicial</Label>
                <Input id="newMedStock" type="number" placeholder="Ej: 50" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                Guardar
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
            {filteredMedications.map((med) => (
              <div
                key={med.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  med.lowStock
                    ? "bg-red-50 border-red-200 hover:border-red-300"
                    : "bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border-emerald-200 hover:border-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                        med.lowStock
                          ? "bg-gradient-to-br from-red-500 to-red-600"
                          : "bg-gradient-to-br from-emerald-500 to-teal-500"
                      }`}
                    >
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{med.name}</h4>
                        {med.lowStock && (
                          <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Stock Bajo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{med.details}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div>
                          <span className="text-xs text-gray-500">Stock Actual: </span>
                          <span
                            className={`font-semibold ${
                              med.lowStock ? "text-red-600" : "text-emerald-600"
                            }`}
                          >
                            {med.stock} unidades
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Stock Mínimo: </span>
                          <span className="font-medium text-gray-700">{med.minStock} unidades</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Dialog>
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
                        <DialogTitle>Editar Stock</DialogTitle>
                        <DialogDescription>
                          Actualiza la cantidad de stock para {editingItem?.name || "este medicamento"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {filteredMedications.filter((m) => m.lowStock).length > 0 && (
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-900">
                  Alerta de Stock Bajo
                </h4>
                <p className="text-sm text-red-700">
                  Hay {filteredMedications.filter((m) => m.lowStock).length} medicamentos con stock por debajo del mínimo requerido.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
