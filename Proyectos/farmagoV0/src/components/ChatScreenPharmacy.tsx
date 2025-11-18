import { useState } from "react";
import { MessageSquare, Send, Image as ImageIcon, User, Clock, CheckCheck } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function ChatScreenPharmacy() {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [message, setMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const customers = [
    {
      id: 1,
      name: "John Doe",
      dni: "12345678",
      lastMessage: "¿Cuánto demora?",
      timestamp: "10:35",
      unread: 1,
      status: "new",
    },
    {
      id: 2,
      name: "María González",
      dni: "87654321",
      lastMessage: "Muchas gracias!",
      timestamp: "10:20",
      unread: 0,
      status: "all",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      dni: "23456789",
      lastMessage: "¿Tienen ibuprofeno?",
      timestamp: "09:45",
      unread: 2,
      status: "new",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "customer",
      customerName: "John Doe",
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
      customerName: "John Doe",
      text: "Sí, claro. Te la envío ahora",
      time: "10:27",
    },
    {
      id: 4,
      sender: "customer",
      customerName: "John Doe",
      type: "image",
      text: "[Receta médica - Dr. Juan Pérez]",
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
      customerName: "John Doe",
      text: "Sí, por favor. ¿Cuánto demora?",
      time: "10:29",
      isUnread: true,
    },
  ];

  const quickReplies = [
    "Stock disponible",
    "Cotización enviada",
    "Necesitamos receta archivada",
    "Su pedido está listo",
  ];

  const filteredCustomers = activeFilter === "new" 
    ? customers.filter(c => c.status === "new")
    : customers;

  return (
    <div className="flex-1 flex">
      {/* Sidebar - Customer List */}
      <div className="w-96 bg-white border-r-2 border-emerald-200 flex flex-col">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
          <h2 className="text-xl font-semibold mb-1">Chats</h2>
          <p className="text-emerald-50 text-sm">Consultas de clientes</p>
        </div>

        {/* Filter Tabs */}
        <div className="p-3 border-b border-emerald-100">
          <div className="flex gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              className={activeFilter === "all" 
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              }
            >
              Todos
            </Button>
            <Button
              variant={activeFilter === "new" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("new")}
              className={activeFilter === "new"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              }
            >
              Nuevos
              {customers.filter(c => c.status === "new").length > 0 && (
                <Badge className="ml-2 bg-red-500">{customers.filter(c => c.status === "new").length}</Badge>
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {filteredCustomers.map((customer) => (
              <Card
                key={customer.id}
                className={`cursor-pointer transition-all ${
                  selectedChat === customer.id
                    ? "border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50"
                    : "border border-emerald-100 hover:border-emerald-300 hover:shadow-md"
                }`}
                onClick={() => setSelectedChat(customer.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-emerald-200">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{customer.name}</h4>
                        <span className="text-xs text-gray-500">{customer.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">DNI: {customer.dni}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 truncate">{customer.lastMessage}</p>
                        {customer.unread > 0 && (
                          <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold ml-2">
                            {customer.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b-2 border-emerald-200 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-emerald-200">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                    {customers.find(c => c.id === selectedChat)?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {customers.find(c => c.id === selectedChat)?.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    DNI: {customers.find(c => c.id === selectedChat)?.dni}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  <User className="h-4 w-4 mr-2" />
                  Ver Perfil
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 p-6">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "pharmacy" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-md ${
                        msg.sender === "pharmacy"
                          ? ""
                          : "flex items-start gap-2"
                      }`}
                    >
                      {msg.sender === "customer" && (
                        <Avatar className="h-8 w-8 ring-2 ring-emerald-200 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                            {msg.customerName?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-md ${
                          msg.sender === "pharmacy"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                            : "bg-white text-gray-900 border border-emerald-100"
                        } ${msg.isUnread ? "ring-2 ring-yellow-400" : ""}`}
                      >
                        {msg.type === "image" ? (
                          <div className="space-y-2">
                            <div className="w-64 h-40 bg-emerald-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                              <ImageIcon className="h-12 w-12 text-emerald-600" />
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-emerald-600 text-white">Receta</Badge>
                              </div>
                            </div>
                            <p className="text-xs opacity-80">{msg.text}</p>
                            <Button 
                              size="sm"
                              variant="outline"
                              className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                            >
                              Ver Imagen Completa
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm">{msg.text}</p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p
                            className={`text-xs ${
                              msg.sender === "pharmacy" ? "text-emerald-100" : "text-gray-500"
                            }`}
                          >
                            {msg.time}
                          </p>
                          {msg.sender === "pharmacy" && (
                            <CheckCheck className="h-4 w-4 text-emerald-100" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="bg-white border-t border-emerald-100 p-3">
              <div className="max-w-4xl mx-auto">
                <p className="text-xs text-gray-600 mb-2 font-medium">Respuestas Rápidas:</p>
                <div className="flex gap-2 flex-wrap">
                  {quickReplies.map((reply, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage(reply)}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t-2 border-emerald-200 p-4">
              <div className="max-w-4xl mx-auto flex gap-3">
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-emerald-50/30 to-teal-50/30">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Selecciona una conversación</h3>
              <p className="text-sm text-gray-600">
                Elige un cliente de la lista para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
