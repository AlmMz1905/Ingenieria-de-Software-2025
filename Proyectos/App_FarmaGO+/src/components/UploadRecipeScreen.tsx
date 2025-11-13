import { useState } from "react";
import { Upload, FileText, X, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

export function UploadRecipeScreen() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorNameError, setDoctorNameError] = useState("");
  const [notes, setNotes] = useState("");

  const validateFileType = (file: File): boolean => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg"
    ];
    
    const allowedExtensions = [".pdf", ".jpg", ".jpeg"];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setFileError("Solo se permiten archivos PDF o JPG.");
      toast.error("Error: Solo se permiten archivos PDF o JPG.");
      return false;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFileError("El archivo no debe superar los 10MB.");
      toast.error("El archivo es demasiado grande (máx. 10MB).");
      return false;
    }
    
    setFileError("");
    return true;
  };

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
      const file = e.dataTransfer.files[0];
      if (validateFileType(file)) {
        setUploadedFile(file);
        toast.success("Archivo cargado exitosamente.");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFileType(file)) {
        setUploadedFile(file);
        toast.success("Archivo cargado exitosamente.");
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileError("");
  };

  const handleSubmit = () => {
    let hasError = false;

    // Validate doctor name
    if (!doctorName.trim()) {
      setDoctorNameError("Este campo es obligatorio");
      hasError = true;
    } else {
      setDoctorNameError("");
    }

    // Validate file upload
    if (!uploadedFile) {
      setFileError("Debes cargar un archivo de receta");
      toast.error("Por favor, carga un archivo de receta.");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Success
    toast.success("¡Receta cargada exitosamente! Será revisada por la farmacia.");
    
    // Reset form
    setUploadedFile(null);
    setDoctorName("");
    setNotes("");
    setFileError("");
    setDoctorNameError("");
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Cargar Receta</h2>
        <p className="text-emerald-50">Sube tu receta médica de forma rápida y segura</p>
      </div>

      <Card className="border-2 border-emerald-100 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
          <CardTitle className="text-emerald-900">Cargar Nueva Receta</CardTitle>
          <CardDescription>
            Sube una receta médica en formato PDF o JPG
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* File Upload Zone */}
            <div>
              <Label className="mb-2 block">Archivo de Receta *</Label>
              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                    dragActive 
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg" 
                      : fileError
                      ? "border-red-300 bg-red-50"
                      : "border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className={`h-10 w-10 ${fileError ? 'text-red-500' : 'text-emerald-600'}`} />
                  </div>
                  <h3 className="font-semibold text-emerald-900 mb-2">
                    Arrastra y suelta tu archivo aquí
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    o haz clic para seleccionar un archivo
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={handleFileInput}
                  />
                  <Button 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Seleccionar Archivo
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    Formatos aceptados: <span className="font-semibold text-emerald-700">PDF, JPG, JPEG</span> (Máx. 10MB)
                  </p>
                </div>
              ) : (
                <div className="border-2 border-emerald-200 rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                        <FileText className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-900">{uploadedFile.name}</h4>
                        <p className="text-sm text-gray-600">
                          {(uploadedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
              
              {fileError && (
                <div className="flex items-center gap-2 mt-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm font-medium">{fileError}</p>
                </div>
              )}
            </div>

            {/* Additional Information Form */}
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="doctorName" className="mb-2 block">
                  Nombre del Médico *
                </Label>
                <Input 
                  id="doctorName"
                  placeholder="Ej: Dr. Juan García"
                  value={doctorName}
                  onChange={(e) => {
                    setDoctorName(e.target.value);
                    if (e.target.value.trim()) {
                      setDoctorNameError("");
                    }
                  }}
                  className={`${
                    doctorNameError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-emerald-200 focus:ring-emerald-500'
                  }`}
                />
                {doctorNameError && (
                  <div className="flex items-center gap-2 mt-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-sm font-medium">{doctorNameError}</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="notes" className="mb-2 block">
                  Notas Adicionales (Opcional)
                </Label>
                <Textarea 
                  id="notes"
                  placeholder="Agrega cualquier nota o comentario sobre esta receta..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border-emerald-200 focus:ring-emerald-500"
                />
              </div>
              
              {/* Info Box */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-900 mb-1">Proceso de Validación</h4>
                    <p className="text-sm text-emerald-800">
                      Una vez que cargues tu receta, será revisada por un farmacéutico profesional. 
                      Recibirás una notificación cuando sea aprobada y podrás proceder con tu pedido.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => {
                    setUploadedFile(null);
                    setDoctorName("");
                    setNotes("");
                    setFileError("");
                    setDoctorNameError("");
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Receta
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
