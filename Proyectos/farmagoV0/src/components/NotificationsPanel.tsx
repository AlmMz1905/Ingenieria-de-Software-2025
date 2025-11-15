import { FileText, Truck, MessageSquare, CheckCircle, Clock, X } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const notifications = [
    {
      id: 1,
      icon: FileText,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      title: "Tu receta fue cotizada",
      description: "Farmacia San José respondió tu consulta",
      timestamp: "Hace 5 min",
      unread: true,
    },
    {
      id: 2,
      icon: Truck,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
      title: "Pedido en camino",
      description: "Tu pedido #PED-042 está siendo entregado",
      timestamp: "Hace 15 min",
      unread: true,
    },
    {
      id: 3,
      icon: MessageSquare,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      title: "Nuevo mensaje del farmacéutico",
      description: "Tienes una consulta pendiente",
      timestamp: "Hace 1 hora",
      unread: true,
    },
    {
      id: 4,
      icon: CheckCircle,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      title: "Receta procesada",
      description: "Tu receta está lista para retirar",
      timestamp: "Hace 2 horas",
      unread: false,
    },
    {
      id: 5,
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Recordatorio de medicación",
      description: "Es hora de tomar tu medicamento",
      timestamp: "Hace 3 horas",
      unread: false,
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed top-16 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border-2 border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">Notificaciones</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[500px]">
          <div className="p-2">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl mb-2 cursor-pointer transition-all hover:shadow-md ${
                    notification.unread
                      ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 ${notification.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${notification.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-emerald-600 mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full text-emerald-700 hover:bg-emerald-100"
          >
            Marcar todas como leídas
          </Button>
        </div>
      </div>
    </>
  );
}
