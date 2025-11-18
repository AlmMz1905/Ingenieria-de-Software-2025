import { useState, useEffect } from "react"; // <--- ¡CAMBIO!
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Bell, ChevronDown, User, CreditCard, LogOut, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NotificationsPanel } from "./NotificationsPanel";
import farmaGoLogo from "figma:asset/de0da3dcf17f0bdd26c5b82838995987a94fac52.png";

interface TopNavigationProps {
  onLogout?: () => void;
  onNavigate?: (section: string, tab?: string) => void;
  userType?: string; // <--- ¡CAMBIO! (Aceptamos el rol)
}

export function TopNavigation({ onLogout, onNavigate, userType }: TopNavigationProps) { // <--- ¡CAMBIO!
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // --- ¡NUEVO! Estado para el nombre de usuario ---
  const [userName, setUserName] = useState("Cargando...");
  
  // --- ¡NUEVO! Leemos el nombre real del localStorage ---
  useEffect(() => {
    // Cuando el componente carga, buscamos el nombre
    const storedName = localStorage.getItem("userName");
    
    if (storedName) {
      setUserName(storedName); // ¡Encontramos el nombre!
    } else {
      setUserName("Usuario"); // Fallback (por si se rompe)
    }
  }, []); // El [] hace que se corra 1 sola vez al cargar
  // --- FIN DE LOS CAMBIOS ---


  const handleNavigate = (section: string, tab?: string) => {
    if (onNavigate) {
      onNavigate(section, tab);
    }
  };

  return (
    <div className="h-16 bg-white border-b border-emerald-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <img 
          src={farmaGoLogo} 
          alt="FarmaGo+" 
          className="w-10 h-10"
        />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">FarmaGo+</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* ... (Botón de Notificaciones y Panel, todo igual) ... */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-emerald-50"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
        >
          <Bell className="h-5 w-5 text-emerald-700" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 text-white rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </Button>

        <NotificationsPanel 
          isOpen={notificationsOpen} 
          onClose={() => setNotificationsOpen(false)} 
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-emerald-50 p-2 rounded-lg transition-colors">
              <Avatar className="h-8 w-8 ring-2 ring-emerald-200">
                {/* --- ¡CAMBIO! Usamos las iniciales del nombre real --- */}
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                {/* --- ¡CAMBIO! ¡No más "John Doe"! --- */}
                <span className="text-sm font-medium text-gray-900">{userName}</span>
                {/* --- ¡CAMBIO! Usamos el rol de verdad --- */}
                <span className="text-xs text-emerald-600">
                  {userType === "empleado" ? "Farmacia" : "Cliente"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-emerald-600" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate('settings', 'profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Configuración de perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('settings', 'payment')}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Métodos de Pago</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Ayuda y Soporte</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}