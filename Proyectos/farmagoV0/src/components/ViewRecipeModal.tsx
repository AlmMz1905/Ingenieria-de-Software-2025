import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Tipado simple para la receta
type Recipe = {
  id: string;
  patientName: string;
  doctorName: string;
  uploadDate: string;
  medications: string[];
  totalPrice: string;
  status: string;
  statusTag: string;
  imageUrl: string;
  phone: string;
};

interface ViewRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
}

export function ViewRecipeModal({ isOpen, onClose, recipe }: ViewRecipeModalProps) {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-semibold text-emerald-900">
            Detalles de Receta - {recipe.id}
          </DialogTitle>
          <DialogDescription>
            Visualización de la receta cargada por {recipe.patientName}.
          </DialogDescription>
        </DialogHeader>

        {/* Este es el layout de dos columnas inspirado 
          en tu captura (image_432ad2.png) 
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Columna 1: Imagen de la Receta */}
          <div className="p-6 pt-0 md:border-r border-gray-200">
            <h3 className="font-semibold text-lg text-emerald-800 mb-3">Imagen de la Receta</h3>
            <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
              <img 
                src={recipe.imageUrl} 
                alt={`Receta ${recipe.id}`} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Columna 2: Datos de la Receta */}
          <div className="p-6 pt-0 md:pt-6">
            <h3 className="font-semibold text-lg text-emerald-800 mb-4">Datos de la Receta</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Paciente:</span>
                <span className="text-gray-900 font-semibold">{recipe.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Teléfono:</span>
                <span className="text-gray-900">{recipe.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Médico:</span>
                <span className="text-gray-900">{recipe.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Fecha de carga:</span>
                <span className="text-gray-900">{recipe.uploadDate}</span>
              </div>

              <hr />

              <div>
                <span className="text-gray-500 font-medium">Medicamentos:</span>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {recipe.medications.map((med, idx) => (
                    <li key={idx} className="text-gray-900">{med}</li>
                  ))}
                </ul>
              </div>

              <hr />

              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium text-lg">Total:</span>
                <span className="text-emerald-600 font-bold text-xl">{recipe.totalPrice}</span>
              </div>
            </div>

            {/* A DIFERENCIA DEL MODAL DE VALIDACIÓN,
              ESTA SECCIÓN DE ACCIONES NO EXISTE.
              ES SOLO LECTURA.
            */}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}