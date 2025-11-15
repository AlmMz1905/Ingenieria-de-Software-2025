import { useState } from "react";
import { User, Edit, Trash2, Plus, UserPlus, Crown } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function UsersScreen() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mainUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    dni: "12345678",
    relationship: "Titular",
    isMain: true,
  };

  const dependents = [
    {
      id: 2,
      firstName: "Jane",
      lastName: "Doe",
      dni: "87654321",
      relationship: "Hija",
      age: 15,
    },
    {
      id: 3,
      firstName: "Robert",
      lastName: "Doe",
      dni: "23456789",
      relationship: "Padre",
      age: 68,
    },
    {
      id: 4,
      firstName: "Mary",
      lastName: "Doe",
      dni: "34567890",
      relationship: "Madre",
      age: 65,
    },
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const getColorScheme = (index: number) => {
    const schemes = [
      { from: "from-emerald-500", to: "to-teal-500", border: "border-emerald-200", bg: "bg-emerald-50" },
      { from: "from-teal-500", to: "to-cyan-500", border: "border-teal-200", bg: "bg-teal-50" },
      { from: "from-cyan-500", to: "to-blue-500", border: "border-cyan-200", bg: "bg-cyan-50" },
      { from: "from-blue-500", to: "to-indigo-500", border: "border-blue-200", bg: "bg-blue-50" },
    ];
    return schemes[index % schemes.length];
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Gestión de Grupo Familiar</h2>
        <p className="text-emerald-50">Administra los miembros de tu familia para una atención personalizada</p>
      </div>

      {/* Add Dependent Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            size="lg"
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar Familiar/Dependiente
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-emerald-900">Agregar Nuevo Familiar</DialogTitle>
            <DialogDescription>
              Completa la información del familiar que deseas agregar a tu grupo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newFirstName">Nombre</Label>
                <Input 
                  id="newFirstName" 
                  placeholder="Ej: María"
                  className="border-emerald-200 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newLastName">Apellido</Label>
                <Input 
                  id="newLastName" 
                  placeholder="Ej: González"
                  className="border-emerald-200 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newDni">DNI</Label>
              <Input 
                id="newDni" 
                placeholder="12345678"
                className="border-emerald-200 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newRelationship">Parentesco</Label>
              <Select>
                <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                  <SelectValue placeholder="Selecciona el parentesco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hijo">Hijo/a</SelectItem>
                  <SelectItem value="padre">Padre</SelectItem>
                  <SelectItem value="madre">Madre</SelectItem>
                  <SelectItem value="conyuge">Cónyuge</SelectItem>
                  <SelectItem value="hermano">Hermano/a</SelectItem>
                  <SelectItem value="abuelo">Abuelo/a</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => setIsDialogOpen(false)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              Agregar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main User Card */}
      <div>
        <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Titular de la Cuenta
        </h3>
        <Card className="border-4 border-emerald-300 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 ring-4 ring-emerald-400">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xl">
                    {getInitials(mainUser.firstName, mainUser.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-semibold text-emerald-900">
                      {mainUser.firstName} {mainUser.lastName}
                    </h4>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
                      <Crown className="h-3 w-3 mr-1" />
                      {mainUser.relationship}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">DNI: {mainUser.dni}</p>
                  <p className="text-xs text-emerald-600 mt-2">Acceso completo a todas las funciones</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dependents */}
      <div>
        <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-emerald-600" />
          Familiares y Dependientes ({dependents.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dependents.map((dependent, index) => {
            const colorScheme = getColorScheme(index);
            return (
              <Card 
                key={dependent.id} 
                className={`border-2 ${colorScheme.border} hover:shadow-xl transition-all hover:scale-105`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className={`h-16 w-16 ring-4 ring-${colorScheme.border} mb-3`}>
                      <AvatarFallback className={`bg-gradient-to-br ${colorScheme.from} ${colorScheme.to} text-white`}>
                        {getInitials(dependent.firstName, dependent.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold text-gray-900">
                      {dependent.firstName} {dependent.lastName}
                    </h4>
                    <Badge variant="outline" className={`mt-2 ${colorScheme.border} text-gray-700`}>
                      {dependent.relationship}
                    </Badge>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-gray-600">DNI: {dependent.dni}</p>
                      {dependent.age && (
                        <p className="text-xs text-gray-600">{dependent.age} años</p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4 w-full">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex-1 ${colorScheme.border} hover:${colorScheme.bg}`}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Card */}
          <Card 
            className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer hover:bg-emerald-50/50"
            onClick={() => setIsDialogOpen(true)}
          >
            <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center min-h-[280px]">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-emerald-900 mb-2">Agregar Familiar</h4>
              <p className="text-sm text-gray-600">
                Añade un nuevo miembro a tu grupo familiar
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Beneficios del Grupo Familiar</h4>
              <p className="text-sm text-gray-700">
                Agrega a tus familiares para gestionar sus recetas médicas, hacer seguimiento de medicamentos 
                y recibir notificaciones personalizadas para cada miembro de tu familia.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
