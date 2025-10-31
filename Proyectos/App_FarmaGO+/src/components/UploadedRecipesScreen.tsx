import { FileText, User, Clock, CheckCircle, XCircle, Eye, Phone, Package, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function UploadedRecipesScreen() {
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
                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Procesar
                </Button>
                <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
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
            <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
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
    </div>
  );
}
