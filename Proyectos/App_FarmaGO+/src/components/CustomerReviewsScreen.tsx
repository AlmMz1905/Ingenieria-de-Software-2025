import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface Review {
  id: number;
  pharmacyName: string;
  rating: number;
  comment: string;
  date: string;
}

export function CustomerReviewsScreen() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      pharmacyName: "Farmacia San José",
      rating: 5,
      comment: "Excelente atención y entrega rápida. Los medicamentos llegaron en perfecto estado.",
      date: "15/11/2024"
    },
    {
      id: 2,
      pharmacyName: "Farmacia del Centro",
      rating: 4,
      comment: "Muy buena experiencia, aunque el delivery tardó un poco más de lo esperado.",
      date: "10/11/2024"
    },
    {
      id: 3,
      pharmacyName: "Farmacia La Plata",
      rating: 5,
      comment: "Perfecto! El farmacéutico me asesoró muy bien sobre la medicación.",
      date: "05/11/2024"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      alert("Por favor, completa todos los campos");
      return;
    }

    const newReview: Review = {
      id: reviews.length + 1,
      pharmacyName: "Farmacia San José", // Mock
      rating,
      comment,
      date: new Date().toLocaleDateString('es-AR')
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
    alert("¡Gracias por tu opinión! Tu reseña ha sido enviada exitosamente.");
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all`}
          >
            <Star
              className={`h-6 w-6 ${
                star <= (interactive ? (hoverRating || rating) : count)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Opiniones y Calificaciones</h2>
        <p className="text-emerald-50">Comparte tu experiencia con FarmaGo+</p>
      </div>

      {/* Submit Review Form */}
      <Card className="border-2 border-emerald-200 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
          <CardTitle className="text-emerald-900">Enviar una Opinión</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Rating */}
            <div className="space-y-2">
              <Label>Calificación</Label>
              <div className="flex items-center gap-3">
                {renderStars(rating, true)}
                {rating > 0 && (
                  <span className="text-sm font-medium text-emerald-700">
                    {rating} de 5 estrellas
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Tu Opinión</Label>
              <Textarea
                id="comment"
                placeholder="Cuéntanos sobre tu experiencia con la farmacia y el servicio..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px] border-emerald-200 focus:ring-emerald-500"
                required
              />
              <p className="text-sm text-gray-500">
                {comment.length}/500 caracteres
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
              size="lg"
            >
              <Send className="h-5 w-5 mr-2" />
              Enviar Opinión
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Review History */}
      <Card className="border-2 border-emerald-100 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
          <CardTitle className="text-emerald-900">Historial de Opiniones</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aún no has enviado ninguna opinión</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-5 bg-gradient-to-br from-white to-emerald-50/30 rounded-xl border-2 border-emerald-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-1">
                        {review.pharmacyName}
                      </h4>
                      {renderStars(review.rating, false)}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
