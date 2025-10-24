import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function UploadRecipeScreen() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload here
      console.log("File dropped:", e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload here
      console.log("File selected:", e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Cargar Receta</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cargar Nueva Receta</CardTitle>
          <CardDescription>
            Sube una receta médica en formato PDF, JPG, DOC o DOCX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* File Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive 
                  ? "border-primary bg-blue-50" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium mb-2">
                Arrastra y suelta tu archivo aquí
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                o haz clic para seleccionar un archivo
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.doc,.docx"
                onChange={handleFileInput}
              />
              <Button 
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Seleccionar Archivo
              </Button>
              <p className="text-xs text-gray-400 mt-4">
                Formatos aceptados: PDF, JPG, DOC, DOCX (Máx. 10MB)
              </p>
            </div>

            {/* Additional Information Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre del Doctor
                </label>
                <Input placeholder="Ej: Dr. García" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notas Adicionales (Opcional)
                </label>
                <Textarea 
                  placeholder="Agrega cualquier nota o comentario sobre esta receta..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancelar</Button>
                <Button>Subir Receta</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
