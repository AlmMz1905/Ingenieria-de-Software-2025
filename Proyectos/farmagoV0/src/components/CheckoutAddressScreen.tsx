import { useState, useEffect } from "react";
import { MapPin, Plus, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";

// --- Interfaces ---
interface Direccion {
  id_direccion: number;
  alias: string;
  calle_numero: string;
  ciudad: string;
  provincia: string;
  codigo_postal: string | null;
  es_predeterminada: boolean;
}

interface ClienteResponse {
  direcciones: Direccion[];
}

// --- Props ---
interface CheckoutAddressScreenProps {
  onContinue: (addressId: number) => void;
  onBack: () => void;
}

export function CheckoutAddressScreen({ onContinue, onBack }: CheckoutAddressScreenProps) {
  
  // --- Estados de data y carga ---
  const [savedAddresses, setSavedAddresses] = useState<Direccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Estados de UI ---
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);
  
  // --- Estados del formulario ---
  const [newAddress, setNewAddress] = useState({
    alias: "",
    calle_numero: "",
    ciudad: "",
    provincia: "",
    codigo_postal: ""
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});


  // --- Carga de Direcciones ---
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!token || !apiUrl) {
        setError("No estás autenticado o la API no está configurada.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/users/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.detail || "No se pudieron cargar tus direcciones.");
        }
        
        const data: ClienteResponse = await response.json();
        setSavedAddresses(data.direcciones);
        
        if (data.direcciones.length > 0) {
          const defaultAddr = data.direcciones.find(d => d.es_predeterminada);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id_direccion);
          } else {
            setSelectedAddressId(data.direcciones[0].id_direccion);
          }
        }
        
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAddresses();
  }, []);


  // --- Lógica de Continuar ---
  const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error("Por favor, selecciona o agrega una dirección de entrega.");
      return;
    }
    onContinue(selectedAddressId);
  };


  // --- (Maqueta) Lógica de Agregar Dirección ---
  const validateNewAddress = () => {
    const errors: {[key: string]: string} = {};
    if (!newAddress.alias.trim()) errors.alias = "El alias es obligatorio";
    if (!newAddress.calle_numero.trim()) errors.calle_numero = "La calle y número son obligatorios";
    if (!newAddress.ciudad.trim()) errors.ciudad = "La ciudad es obligatoria";
    if (!newAddress.provincia.trim()) errors.provincia = "La provincia es obligatoria";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewAddress = () => {
    if (!validateNewAddress()) return;

    const tempAddress: Direccion = {
      id_direccion: Date.now(),
      alias: newAddress.alias,
      calle_numero: newAddress.calle_numero,
      ciudad: newAddress.ciudad,
      provincia: newAddress.provincia,
      codigo_postal: newAddress.codigo_postal,
      es_predeterminada: savedAddresses.length === 0,
    };

    setSavedAddresses([...savedAddresses, tempAddress]);
    setSelectedAddressId(tempAddress.id_direccion);
    setShowAddNew(false);
    setNewAddress({ alias: "", calle_numero: "", ciudad: "", provincia: "", codigo_postal: "" });
    setFormErrors({});
    toast.success("Dirección agregada temporalmente.");
  };
  
  
  // --- Pantallas de Carga y Error ---
  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error al cargar direcciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  // --- Render ---
  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/5J0">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Dirección de Entrega</h2>
        <p className="text-emerald-50">Paso 1 de 2 - Selecciona dónde quieres recibir tu pedido</p>
      </div>

      {/* ¡¡¡ESTA ES LA PARTE QUE FALTABA!!! */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
            1
          </div>
          <span className="font-semibold text-emerald-900">Dirección</span>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold">
            2
          </div>
          <span className="text-gray-500">Pago</span>
        </div>
      </div>

      {/* Lógica de "Sin Direcciones" */}
      {savedAddresses.length === 0 && !showAddNew && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  No tienes direcciones guardadas
                </h4>
                <p className="text-sm text-yellow-800 mb-4">
                  Para continuar con tu pedido, debes agregar una dirección de entrega.
                </p>
                <Button
                  onClick={() => setShowAddNew(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Dirección
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lógica de "Mostrar Direcciones" (¡con las clases BIEN!) */}
      {savedAddresses.length > 0 && !showAddNew && (
        <>
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100 flex flex-row items-center justify-between">
              <CardTitle className="text-emerald-900">Selecciona una Dirección</CardTitle>
              <Button
                onClick={() => setShowAddNew(true)}
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Dirección
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={selectedAddressId?.toString()} onValueChange={(val) => setSelectedAddressId(parseInt(val))}>
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id_direccion}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedAddressId === address.id_direccion
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md'
                          : 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                      onClick={() => setSelectedAddressId(address.id_direccion)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={address.id_direccion.toString()} id={`address-${address.id_direccion}`} />
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-emerald-900">{address.alias}</h4>
                            {address.es_predeterminada && (
                              <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {address.calle_numero}, {address.ciudad}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </>
      )}

      {/* Lógica de "Agregar Nueva" (¡con las clases BIEN!) */}
      {showAddNew && (
        <Card className="border-2 border-emerald-100 shadow-lg">
          <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
            <CardTitle className="text-emerald-900">Agregar Nueva Dirección</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="alias">Alias de la Dirección *</Label>
                <Input
                  id="alias"
                  placeholder="Ej: Casa, Trabajo"
                  value={newAddress.alias}
                  onChange={(e) => setNewAddress({ ...newAddress, alias: e.target.value })}
                  className={formErrors.alias ? 'border-red-500' : 'border-emerald-200'}
                />
                {formErrors.alias && <p className="text-sm text-red-600 mt-1">{formErrors.alias}</p>}
              </div>
              
              <div>
                <Label htmlFor="calle_numero">Calle y Número *</Label>
                <Input
                  id="calle_numero"
                  placeholder="Calle 7 N° 822"
                  value={newAddress.calle_numero}
                  onChange={(e) => setNewAddress({ ...newAddress, calle_numero: e.target.value })}
                  className={formErrors.calle_numero ? 'border-red-500' : 'border-emerald-200'}
                />
                {formErrors.calle_numero && <p className="text-sm text-red-600 mt-1">{formErrors.calle_numero}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ciudad">Ciudad *</Label>
                  <Input
                    id="ciudad"
                    placeholder="La Plata"
                    value={newAddress.ciudad}
                    onChange={(e) => setNewAddress({ ...newAddress, ciudad: e.target.value })}
                    className={formErrors.ciudad ? 'border-red-500' : 'border-emerald-200'}
                  />
                  {formErrors.ciudad && <p className="text-sm text-red-600 mt-1">{formErrors.ciudad}</p>}
                </div>
                <div>
                  <Label htmlFor="provincia">Provincia *</Label>
                  <Input
                    id="provincia"
                    placeholder="Buenos Aires"
                    value={newAddress.provincia}
                    onChange={(e) => setNewAddress({ ...newAddress, provincia: e.target.value })}
                    className={formErrors.provincia ? 'border-red-500' : 'border-emerald-200'}
                  />
                  {formErrors.provincia && <p className="text-sm text-red-600 mt-1">{formErrors.provincia}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => { setShowAddNew(false); setFormErrors({}); }}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveNewAddress}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                >
                  Guardar Dirección
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons (¡con las clases BIEN!) */}
      {!showAddNew && (
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
          >
            Volver al Carrito
          </Button>
          <Button
            onClick={handleContinue}
            disabled={savedAddresses.length === 0 || !selectedAddressId}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
          >
            Continuar al Pago
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}