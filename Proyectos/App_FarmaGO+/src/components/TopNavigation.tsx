import { useState, MouseEvent } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Bell, ChevronDown, Settings, CreditCard, LogOut, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NotificationsPanel } from "./NotificationsPanel";

interface TopNavigationProps {
  onLogout?: () => void;
  onNavigate?: (section: string) => void;
}

export function TopNavigation({ onLogout, onNavigate }: TopNavigationProps) {
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  const handleNavigate = (section: string): void => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  const handleNotificationsClick = (): void => {
    setNotificationsOpen(!notificationsOpen);
  };

  return (
    <div className="h-16 bg-white border-b border-emerald-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
          F+
        </div>
        <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">FarmaGo+</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-emerald-50"
          onClick={handleNotificationsClick}
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
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">John Doe</span>
                <span className="text-xs text-emerald-600">Usuario</span>
              </div>
              <ChevronDown className="h-4 w-4 text-emerald-600" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavigate('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('payment')}>
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