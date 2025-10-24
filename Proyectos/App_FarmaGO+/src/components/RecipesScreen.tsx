import { useState } from "react";
import { FileText, Clock, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

interface Recipe {
  id: string;
  name: string;
  uploadDate: string;
  fileType: string;
  doctor: string;
  status: "pending" | "approved" | "rejected";
}

export function RecipesScreen() {
  const [recipes] = useState<Recipe[]>([
    { 
      id: "1", 
      name: "Receta_Antibioticos_2025.pdf", 
      uploadDate: "2025-10-15", 
      fileType: "pdf", 
      doctor: "Dr. García",
      status: "approved"
    },
    { 
      id: "2", 
      name: "Receta_Cardiovascular_2025.jpg", 
      uploadDate: "2025-10-10", 
      fileType: "jpg", 
      doctor: "Dr. Martínez",
      status: "approved"
    },
    { 
      id: "3", 
      name: "Receta_Control_Mensual.pdf", 
      uploadDate: "2025-10-05", 
      fileType: "pdf", 
      doctor: "Dr. López",
      status: "pending"
    },
    { 
      id: "4", 
      name: "Receta_Vitaminas.docx", 
      uploadDate: "2025-09-28", 
      fileType: "docx", 
      doctor: "Dr. Fernández",
      status: "approved"
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Aprobada</Badge>;
      case "pending":
        return <Badge variant="secondary">Pendiente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return null;
    }
  };

  const getFileIcon = (fileType: string) => {
    return <FileText className="h-5 w-5 text-blue-600" />;
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mis Recetas</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Recetas</CardTitle>
          <CardDescription>
            Todas las recetas médicas que has subido al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getFileIcon(recipe.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium truncate">{recipe.name}</p>
                      {getStatusBadge(recipe.status)}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(recipe.uploadDate).toLocaleDateString('es-ES')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {recipe.doctor}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
