import { useState } from "react";
import { MessageSquare, Send, Paperclip, Image as ImageIcon, ArrowLeft, Phone, MoreVertical } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";

export function ChatScreenCustomer() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Consulta de Medicamentos (General)",
      status: "Online",
      lastMessage: "¿En qué puedo ayudarte?",
      timestamp: "10:30",
      unread: 0,
      isOnline: true,
    },
    {
      id: 2,
      name: "Farmacia San José",
      status: "Mi Farmacia",
      lastMessage: "Tu pedido está listo para retirar",
      timestamp: "Ayer",
      unread: 2,
      isOnline: true,
    },
    {
      id: 3,
      name: "Farmacia del Centro",
      status: "Offline",
      lastMessage: "Gracias por tu consulta",
      timestamp: "25 Oct",
      unread: 0,
      isOnline: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "customer",
      text: "Hola, quería consultar por una receta",
      time: "10:25",
    },
    {
      id: 2,
      sender: "pharmacy",
      text: "¡Hola! Claro, con gusto te ayudo. ¿Podrías enviarme una foto de la receta?",
      time: "10:26",
    },
    {
      id: 3,
      sender: "customer",
      text: "Sí, claro. Te la envío ahora",
      time: "10:27",
    },
    {
      id: 4,
      sender: "customer",
      type: "image",
      text: "[Imagen de receta médica]",
      time: "10:27",
    },
    {
      id: 5,
      sender: "pharmacy",
      text: "Perfecto, ya revisé la receta. Tenemos todos los medicamentos disponibles. El total sería $3,200. ¿Querés que te prepare el pedido?",
      time: "10:28",
    },
    {
      id: 6,
      sender: "customer",
      text: "Sí, por favor. ¿Cuánto demora?",
      time: "10:29",
    },
    {
      id: 7,
      sender: "pharmacy",
      text: "Estará listo en 15 minutos. ¿Lo pasás a buscar o preferís delivery?",
      time: "10:30",
    },
  ];

  if (selectedChat) {
    const chat = conversations.find(c => c.id === selectedChat);
    
    return (
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-between px-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChat(null)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10 ring-2 ring-white">
              <AvatarFallback className="bg-white text-emerald-600 font-semibold">
                {chat?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">{chat?.name}</h3>
              <p className="text-xs text-emerald-100">
                {chat?.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    msg.sender === "customer"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                      : "bg-white text-gray-900 border border-emerald-100"
                  }`}
                >
                  {msg.type === "image" ? (
                    <div className="space-y-2">
                      <div className="w-64 h-40 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-emerald-600" />
                      </div>
                      <p className="text-xs opacity-80">{msg.text}</p>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.text}</p>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === "customer" ? "text-emerald-100" : "text-gray-500"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white border-t-2 border-emerald-200 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 border-emerald-200 focus:ring-emerald-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setMessage("");
                }
              }}
            />
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Consultas con Farmacia</h2>
        <p className="text-emerald-50">Consulta sobre medicamentos y envía tus recetas</p>
      </div>

      {/* Conversations List */}
      <div className="space-y-3">
        {conversations.map((conv) => (
          <Card
            key={conv.id}
            className="border-2 border-emerald-100 hover:border-emerald-300 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setSelectedChat(conv.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-14 w-14 ring-2 ring-emerald-200">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-lg">
                      {conv.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{conv.name}</h4>
                    <span className="text-xs text-gray-500 ml-2">{conv.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2 ml-2">
                      {conv.isOnline && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          {conv.status}
                        </Badge>
                      )}
                      {conv.unread > 0 && (
                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">¿Necesitás ayuda?</h4>
              <p className="text-sm text-gray-700">
                Consulta sobre medicamentos y envía fotos de tus recetas 
                para obtener cotizaciones al instante.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
