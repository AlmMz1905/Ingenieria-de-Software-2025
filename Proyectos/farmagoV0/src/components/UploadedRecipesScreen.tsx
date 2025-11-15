import { FileText, User, Clock, CheckCircle, XCircle, Eye, Phone, Package, Calendar, ZoomIn, ZoomOut, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function UploadedRecipesScreen() {
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rejectionReason, setRejectionReason] = useState("");
  
  const recipes = [
    {
      id: "REC-001",
      patientName: "María González",
      phone: "+54 11 2345-6789",
      uploadDate: "28 Oct 2025, 09:15",
      status: "pending",
      medications: ["Ibuprofeno 400mg x30", "Amoxicilina 500mg x20"],
      doctor: "Dr. Juan Pérez",
      total: "$3,200",
      priority: "normal",
    },
    {
      id: "REC-002",
      patientName: "Carlos Rodríguez",
      phone: "+54 11 3456-7890",
      uploadDate: "28 Oct 2025, 08:45",
      status: "processing",
      medications: ["Atorvastatina 20mg x30", "Losartán 50mg x30"],
      doctor: "Dra. Ana Martínez",
      total: "$4,500",
      priority: "normal",
    },
    {
      id: "REC-003",
      patientName: "Ana Martínez",
      phone: "+54 11 4567-8901",
      uploadDate: "28 Oct 2025, 07:30",
      status: "ready",
      medications: ["Paracetamol 500mg x20"],
      doctor: "Dr. Luis Fernández",
      total: "$800",
      priority: "low",
    },
    {
      id: "REC-004",
      patientName: "Juan Pérez",
      phone: "+54 11 5678-9012",
      uploadDate: "27 Oct 2025, 18:20",
      status: "completed",
      medications: ["Omeprazol 20mg x30", "Metformina 850mg x60"],
      doctor: "Dra. Laura Sánchez",
      total: "$2,900",
      priority: "normal",
    },
    {
      id: "REC-005",
      patientName: "Laura Fernández",
      phone: "+54 11 6789-0123",
      uploadDate: "28 Oct 2025, 10:00",
      status: "pending",
      medications: ["Insulina Glargina", "Tiras reactivas x50"],
      doctor: "Dr. Roberto García",
      total: "$8,500",
      priority: "high",
    },
    {
      id: "REC-006",
      patientName: "Roberto García",
      phone: "+54 11 7890-1234",
      uploadDate: "28 Oct 2025, 06:50",
      status: "rejected",
      medications: ["Receta ilegible"],
      doctor: "N/A",
      total: "$0",
      priority: "normal",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendiente</Badge>;
      case "processing":
        return <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500">En Proceso</Badge>;
      case "ready":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Lista para Retirar</Badge>;
      case "completed":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Completada</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">Rechazada</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">Alta</Badge>;
      case "normal":
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">Normal</Badge>;
      case "low":
        return <Badge variant="outline" className="border-gray-500 text-gray-700 bg-gray-50">Baja</Badge>;
      default:
        return null;
    }
  };

  const filterByStatus = (status: string) => {
    if (status === "all") return recipes;
    return recipes.filter(recipe => recipe.status === status);
  };

  const handleOpenValidation = (recipe: any) => {
    setSelectedRecipe(recipe);
    setValidationModalOpen(true);
    setZoomLevel(1);
  };

  const handleApprove = () => {
    alert(`Receta ${selectedRecipe?.id} aprobada exitosamente`);
    setValidationModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleReject = () => {
    setValidationModalOpen(false);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    alert(`Receta ${selectedRecipe?.id} rechazada. Razón: ${rejectionReason}`);
    setRejectModalOpen(false);
    setSelectedRecipe(null);
    setRejectionReason("");
  };

  const RecipeCard = ({ recipe }: { recipe: typeof recipes[0] }) => (
    <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{recipe.patientName}</CardTitle>
              <p className="text-sm text-gray-600">{recipe.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {getPriorityBadge(recipe.priority)}
            {getStatusBadge(recipe.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recipe Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl">
          <div className="flex items-start gap-2">
            <User className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Médico Prescriptor</p>
              <p className="text-xs text-gray-600">{recipe.doctor}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-teal-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Fecha de carga</p>
              <p className="text-xs text-gray-600">{recipe.uploadDate}</p>
            </div>
          </div>
        </div>

        {/* Medications */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-emerald-600" />
            Medicamentos:
          </p>
          <ul className="space-y-1">
            {recipe.medications.map((med, idx) => (
              <li key={idx} className="text-sm text-gray-700 pl-6">• {med}</li>
            ))}
          </ul>
        </div>

        {/* Total and Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-lg font-semibold text-emerald-700">{recipe.total}</span>
          <div className="flex gap-2">
            {recipe.status === "pending" && (
              <>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  onClick={() => handleOpenValidation(recipe)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Procesar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-red-300 text-red-700 hover:bg-red-50" 
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    handleReject();
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Rechazar
                </Button>
              </>
            )}
            {recipe.status === "processing" && (
              <>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Marcar Lista
                </Button>
              </>
            )}
            {recipe.status === "ready" && (
              <>
                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Entregar
                </Button>
                <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                  <Phone className="h-4 w-4 mr-1" />
                  Llamar
                </Button>
              </>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              onClick={() => handleOpenValidation(recipe)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Recetas Cargadas</h2>
        <p className="text-emerald-50">Gestiona las recetas médicas de los pacientes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-2 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-yellow-600">
                  {filterByStatus("pending").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Proceso</p>
                <p className="text-2xl font-semibold text-emerald-600">
                  {filterByStatus("processing").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Listas</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {filterByStatus("ready").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {filterByStatus("completed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rechazadas</p>
                <p className="text-2xl font-semibold text-red-600">
                  {filterByStatus("rejected").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recipes List with Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="processing">En Proceso</TabsTrigger>
          <TabsTrigger value="ready">Listas</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
          <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filterByStatus("pending").map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {filterByStatus("processing").map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          {filterByStatus("ready").map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterByStatus("completed").map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filterByStatus("rejected").map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Validation Modal - Full Screen with Two Panels */}
      <Dialog open={validationModalOpen} onOpenChange={setValidationModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Validar Receta - {selectedRecipe?.id}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 h-[70vh]">
            {/* Left Panel - Image */}
            <div className="flex flex-col border-2 border-emerald-200 rounded-xl p-4 bg-gray-50">
              <h4 className="font-semibold text-emerald-900 mb-3">Imagen de la Receta</h4>
              <div className="flex-1 overflow-auto flex items-center justify-center bg-white rounded-lg border border-gray-200">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758691462814-485c3672e447?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzY3JpcHRpb24lMjBtZWRpY2FsJTIwZG9jdW1lbnR8ZW58MXx8fHwxNzYyNTIzNzUzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Receta Médica"
                  className="max-w-full max-h-full object-contain"
                  style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s' }}
                />
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Panel - Data & Actions */}
            <div className="flex flex-col space-y-4">
              <Card className="border-2 border-emerald-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Datos de la Receta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-600">Paciente</Label>
                      <p className="font-medium">{selectedRecipe?.patientName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Teléfono</Label>
                      <p className="font-medium">{selectedRecipe?.phone}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Médico</Label>
                      <p className="font-medium">{selectedRecipe?.doctor}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Fecha de carga</Label>
                      <p className="font-medium">{selectedRecipe?.uploadDate}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Medicamentos</Label>
                    <ul className="mt-1 space-y-1">
                      {selectedRecipe?.medications.map((med: string, idx: number) => (
                        <li key={idx} className="text-sm">• {med}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Total</Label>
                    <p className="text-lg font-semibold text-emerald-600">{selectedRecipe?.total}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-100 flex-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Acciones de Validación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h5 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Receta Válida
                    </h5>
                    <p className="text-sm text-gray-700 mb-3">
                      La receta cumple con todos los requisitos y puede ser procesada.
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      onClick={handleApprove}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprobar Receta
                    </Button>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Receta No Válida
                    </h5>
                    <p className="text-sm text-gray-700 mb-3">
                      La receta tiene problemas que impiden su procesamiento.
                    </p>
                    <Button 
                      variant="outline"
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                      onClick={handleReject}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rechazar Receta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Motivo de Rechazo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionSelect">Seleccione el motivo</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger id="rejectionSelect" className="w-full mt-2">
                  <SelectValue placeholder="Seleccione un motivo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="illegible">Foto Ilegible / Datos Incompletos</SelectItem>
                  <SelectItem value="expired">Receta Vencida</SelectItem>
                  <SelectItem value="unregistered">Médico No Registrado</SelectItem>
                  <SelectItem value="invalid">Información Inválida</SelectItem>
                  <SelectItem value="missing">Faltan Datos Obligatorios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700">
                {rejectionReason === "illegible" && "La imagen no permite leer correctamente los datos de la receta."}
                {rejectionReason === "expired" && "La receta ha superado su fecha de validez."}
                {rejectionReason === "unregistered" && "El médico prescriptor no está registrado en el sistema."}
                {rejectionReason === "invalid" && "La información proporcionada no es válida."}
                {rejectionReason === "missing" && "Faltan datos obligatorios en la receta."}
                {!rejectionReason && "Seleccione un motivo para continuar."}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setRejectModalOpen(false);
                setRejectionReason("");
              }}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
              onClick={handleConfirmReject}
              disabled={!rejectionReason}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Confirmar Rechazo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
