import { useState } from "react";
import { Star, Send, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function CustomerReviewsScreen() {
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const pharmacies = [
    { id: "1", name: "Farmacia del Centro" },
    { id: "2", name: "Farmacia La Salud" },
    { id: "3", name: "Farmacia San Martín" },
    { id: "4", name: "Farmacia Cruz Verde" },
    { id: "5", name: "Farmacia del Pueblo" },
  ];

  const myReviews = [
    {
      id: 1,
      pharmacyName: "Farmacia del Centro",
      rating: 5,
      comment: "Excelente atención y rapidez en la entrega. Los medicamentos llegaron en perfecto estado.",
      date: "2 Nov 2025",
    },
    {
      id: 2,
      pharmacyName: "Farmacia La Salud",
      rating: 4,
      comment: "Muy buen servicio, aunque la entrega tard�� un poco más de lo esperado.",
      date: "28 Oct 2025",
    },
    {
      id: 3,
      pharmacyName: "Farmacia San Martín",
      rating: 5,
      comment: "Perfecta experiencia. El personal muy atento y profesional.",
      date: "15 Oct 2025",
    },
    {
      id: 4,
      pharmacyName: "Farmacia Cruz Verde",
      rating: 3,
      comment: "Servicio correcto, pero podrían mejorar los tiempos de respuesta.",
      date: "8 Oct 2025",
    },
  ];

  const handleSubmit = () => {
    if (!selectedPharmacy || rating === 0 || !comment.trim()) {
      alert("Por favor complete todos los campos antes de enviar.");
      return;
    }
    
    alert("¡Gracias por tu opinión! Tu reseña ha sido enviada exitosamente.");
    
    // Reset form
    setSelectedPharmacy("");
    setRating(0);
    setComment("");
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-all ${
              star <= (interactive ? (hoveredRating || rating) : currentRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Opiniones</h2>
        <p className="text-emerald-50">Comparte tu experiencia y consulta tus valoraciones anteriores</p>
      </div>

      {/* Submit Review Section */}
      <Card className="border-2 border-emerald-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Send className="h-5 w-5 text-emerald-600" />
            Enviar una Opinión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pharmacy Selection */}
          <div className="space-y-2">
            <Label htmlFor="pharmacy">Seleccionar Farmacia</Label>
            <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
              <SelectTrigger id="pharmacy" className="border-emerald-200 focus:ring-emerald-500">
                <SelectValue placeholder="Selecciona una farmacia..." />
              </SelectTrigger>
              <SelectContent>
                {pharmacies.map((pharmacy) => (
                  <SelectItem key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating Selection */}
          <div className="space-y-2">
            <Label>Calificación</Label>
            <div className="flex items-center gap-3">
              {renderStars(rating, true)}
              {rating > 0 && (
                <span className="text-sm text-gray-600">
                  ({rating} {rating === 1 ? "estrella" : "estrellas"})
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Tu Comentario</Label>
            <Textarea
              id="comment"
              placeholder="Comparte tu experiencia con esta farmacia..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              className="border-emerald-200 focus:ring-emerald-500 resize-none"
            />
            <p className="text-xs text-gray-500">{comment.length} / 500 caracteres</p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <Send className="h-4 w-4 mr-2" />
            Enviar Opinión
          </Button>
        </CardContent>
      </Card>

      {/* My Review History Section */}
      <Card className="border-2 border-emerald-100 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            Historial de Opiniones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {myReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Aún no has enviado ninguna opinión.</p>
              <p className="text-sm">¡Comparte tu experiencia con las farmacias!</p>
            </div>
          ) : (
            myReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl border-2 border-emerald-100 hover:border-emerald-200 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-emerald-900">{review.pharmacyName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-sm text-gray-600">{review.date}</p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
