import { 
  Home, 
  ShoppingCart, 
  FileText, 
  Upload,
  MessageSquare,
  Map, 
  BarChart3, 
  Users, 
  Settings 
} from "lucide-react";
import { Button } from "./ui/button";

interface SideNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function SideNavigation({ activeSection, onSectionChange }: SideNavigationProps) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "sales", label: "Carrito", icon: ShoppingCart },
    { id: "products", label: "Mis recetas", icon: FileText },
    { id: "upload-recipe", label: "Cargar Receta", icon: Upload },
    { id: "pharmacy-chat", label: "Chat con Farmacias", icon: MessageSquare },
    { id: "inventory", label: "Mapa", icon: Map },
    { id: "reports", label: "Opiniones", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-emerald-50 to-teal-50 border-r border-emerald-200 h-full flex flex-col shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-emerald-900">¡Hola!</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-11 transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:from-emerald-600 hover:to-teal-600" 
                  : "text-emerald-900 hover:bg-white hover:text-emerald-700 hover:shadow-sm"
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}