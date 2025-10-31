import { useState } from "react";
import { MessageSquare, Send, ArrowLeft, User, Store } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";

export function ChatScreenDelivery() {
  const [chatType, setChatType] = useState<"selection" | "customer" | "pharmacy" | null>("selection");
  const [message, setMessage] = useState("");

  const quickMessages = [
    "Estoy llegando.",
    "No encuentro la dirección.",
    "Estoy en la puerta.",
    "OK",
  ];

  const customerMessages = [
    {
      id: 1,
      sender: "customer",
      text: "Hola, ¿cuánto falta?",
      time: "14:25",
    },
    {
      id: 2,
      sender: "driver",
      text: "Estoy llegando.",
      time: "14:26",
    },
    {
      id: 3,
      sender: "customer",
      text: "Dale, te espero",
      time: "14:26",
    },
  ];

  const pharmacyMessages = [
    {
      id: 1,
      sender: "pharmacy",
      text: "El pedido está listo, pasá a retirarlo",
      time: "14:20",
    },
    {
      id: 2,
      sender: "driver",
      text: "OK",
      time: "14:21",
    },
  ];

  if (chatType === "selection") {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50/30 to-cyan-50/30 p-6">
        <div className="max-w-md w-full space-y-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Selecciona un chat</h2>
            <p className="text-sm text-gray-600">Elige con quién querés comunicarte</p>
          </div>

          <Card 
            className="border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-xl hover:scale-105"
            onClick={() => setChatType("customer")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 text-lg">Chatear con el Cliente</h3>
                  <p className="text-sm text-gray-600">John Doe</p>
                </div>
                <div className="text-blue-600">→</div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-2 border-emerald-200 hover:border-emerald-400 cursor-pointer transition-all hover:shadow-xl hover:scale-105"
            onClick={() => setChatType("pharmacy")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Store className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-emerald-900 text-lg">Chatear con la Farmacia</h3>
                  <p className="text-sm text-gray-600">F. San José</p>
                </div>
                <div className="text-emerald-600">→</div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Reminder */}
          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Recordatorio de Seguridad</h4>
                  <p className="text-xs text-gray-700">
                    Usá los mensajes rápidos mientras manejás. No escribas mientras estés en movimiento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const messages = chatType === "customer" ? customerMessages : pharmacyMessages;
  const chatName = chatType === "customer" ? "John Doe" : "Farmacia San José";
  const chatInitials = chatType === "customer" ? "JD" : "FS";
  const chatColor = chatType === "customer" ? "from-blue-500 to-cyan-500" : "from-emerald-500 to-teal-500";

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className={`h-16 bg-gradient-to-r ${chatColor} flex items-center justify-between px-6 shadow-lg`}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChatType("selection")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10 ring-2 ring-white">
            <AvatarFallback className="bg-white text-gray-700 font-semibold">
              {chatInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">{chatName}</h3>
            <p className="text-xs text-white/80">
              {chatType === "customer" ? "Cliente" : "Farmacia"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "driver" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl shadow-md ${
                  msg.sender === "driver"
                    ? `bg-gradient-to-r ${chatColor} text-white`
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "driver" ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Messages */}
      <div className="bg-white border-t-2 border-gray-200 p-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-xs text-gray-600 font-medium">Mensajes Rápidos (Toca para enviar):</p>
          <div className="grid grid-cols-2 gap-2">
            {quickMessages.map((quickMsg, idx) => (
              <Button
                key={idx}
                variant="outline"
                className={`h-14 text-sm font-medium border-2 ${
                  chatType === "customer"
                    ? "border-blue-300 text-blue-700 hover:bg-blue-50"
                    : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                {quickMsg}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 border-gray-300 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setMessage("");
              }
            }}
          />
          <Button className={`bg-gradient-to-r ${chatColor} hover:opacity-90`}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">
          💡 Usá los mensajes rápidos por seguridad mientras manejas
        </p>
      </div>
    </div>
  );
}
