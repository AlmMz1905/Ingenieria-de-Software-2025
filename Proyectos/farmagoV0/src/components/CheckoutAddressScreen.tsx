import { useState } from "react";
import { MapPin, Plus, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface Address {
  id: number;
  name: string;
  address: string;
  isDefault: boolean;
}

interface CheckoutAddressScreenProps {
  onContinue: (addressId: number) => void;
  onBack: () => void;
}

export function CheckoutAddressScreen({ onContinue, onBack }: CheckoutAddressScreenProps) {
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "Casa",
      address: "Calle 7 N° 822, La Plata, Buenos Aires",
      isDefault: true,
    },
    {
      id: 2,
      name: "Trabajo",
      address: "Av. 51 N° 1234, La Plata, Buenos Aires",
      isDefault: false,
    },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<number>(1);
  const [showAddNew, setShowAddNew] = useState(false);
  
  // Form for new address
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    number: "",
    city: "",
    province: "",
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleContinue = () => {
    if (savedAddresses.length === 0) {
      // Must add address first
      return;
    }
    
    if (!selectedAddressId) {
      setFormErrors({ general: "Por favor, selecciona una dirección de entrega." });
      return;
    }

    onContinue(selectedAddressId);
  };

  const validateNewAddress = () => {
    const errors: {[key: string]: string} = {};

    if (!newAddress.name.trim()) errors.name = "El nombre es obligatorio";
    if (!newAddress.street.trim()) errors.street = "La calle es obligatoria";
    if (!newAddress.number.trim()) errors.number = "El número es obligatorio";
    if (!newAddress.city.trim()) errors.city = "La ciudad es obligatoria";
    if (!newAddress.province.trim()) errors.province = "La provincia es obligatoria";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNewAddress = () => {
    if (!validateNewAddress()) {
      return;
    }

    const address: Address = {
      id: savedAddresses.length + 1,
      name: newAddress.name,
      address: `${newAddress.street} N° ${newAddress.number}, ${newAddress.city}, ${newAddress.province}`,
      isDefault: savedAddresses.length === 0,
    };

    setSavedAddresses([...savedAddresses, address]);
    setSelectedAddressId(address.id);
    setShowAddNew(false);
    setNewAddress({ name: "", street: "", number: "", city: "", province: "" });
    setFormErrors({});
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Dirección de Entrega</h2>
        <p className="text-emerald-50">Paso 1 de 2 - Selecciona dónde quieres recibir tu pedido</p>
      </div>

      {/* Progress Indicator */}
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
              <RadioGroup value={selectedAddressId.toString()} onValueChange={(val) => setSelectedAddressId(parseInt(val))}>
                <div className="space-y-4">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedAddressId === address.id
                          ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md'
                          : 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-emerald-900">{address.name}</h4>
                            {address.isDefault && (
                              <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{address.address}</p>
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

      {showAddNew && (
        <Card className="border-2 border-emerald-100 shadow-lg">
          <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
            <CardTitle className="text-emerald-900">Agregar Nueva Dirección</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre de la Dirección *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Casa, Trabajo"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className={formErrors.name ? 'border-red-500' : 'border-emerald-200'}
                />
                {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">Calle *</Label>
                  <Input
                    id="street"
                    placeholder="Av. Corrientes"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className={formErrors.street ? 'border-red-500' : 'border-emerald-200'}
                  />
                  {formErrors.street && <p className="text-sm text-red-600 mt-1">{formErrors.street}</p>}
                </div>
                <div>
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    placeholder="1234"
                    value={newAddress.number}
                    onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                    className={formErrors.number ? 'border-red-500' : 'border-emerald-200'}
                  />
                  {formErrors.number && <p className="text-sm text-red-600 mt-1">{formErrors.number}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    placeholder="La Plata"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className={formErrors.city ? 'border-red-500' : 'border-emerald-200'}
                  />
                  {formErrors.city && <p className="text-sm text-red-600 mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="province">Provincia *</Label>
                  <Input
                    id="province"
                    placeholder="Buenos Aires"
                    value={newAddress.province}
                    onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                    className={formErrors.province ? 'border-red-500' : 'border-emerald-200'}
                  />
                  {formErrors.province && <p className="text-sm text-red-600 mt-1">{formErrors.province}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddNew(false);
                    setNewAddress({ name: "", street: "", number: "", city: "", province: "" });
                    setFormErrors({});
                  }}
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

      {/* Action Buttons */}
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
            disabled={savedAddresses.length === 0}
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
