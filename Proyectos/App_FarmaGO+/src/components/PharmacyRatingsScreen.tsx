import { Star, TrendingUp, Award, ThumbsUp, MessageSquare, Store, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";

export function PharmacyRatingsScreen() {
  const ratings = [
    {
      id: 1,
      customerName: "María González",
      date: "27 Oct 2025",
      rating: 5,
      comment: "Excelente atención farmacéutica. Personal muy capacitado y amable. Siempre encuentro todo lo que necesito.",
      orderId: "REC-045",
      employeeName: "Farmacéutico: Juan Pérez",
    },
    {
      id: 2,
      customerName: "Carlos Rodríguez",
      date: "26 Oct 2025",
      rating: 5,
      comment: "Muy profesionales, explicaron bien el uso de cada medicamento. Farmacia limpia y ordenada.",
      orderId: "REC-042",
      employeeName: "Farmacéutico: Ana Martínez",
    },
    {
      id: 3,
      customerName: "Ana Martínez",
      date: "25 Oct 2025",
      rating: 4,
      comment: "Buen servicio y precios razonables. A veces hay que esperar un poco pero vale la pena.",
      orderId: "REC-038",
      employeeName: "Farmacéutico: Luis Fernández",
    },
    {
      id: 4,
      customerName: "Juan Pérez",
      date: "24 Oct 2025",
      rating: 5,
      comment: "Increíble servicio, atención personalizada y rápida. Muy recomendable!",
      orderId: "REC-035",
      employeeName: "Farmacéutico: Laura Sánchez",
    },
    {
      id: 5,
      customerName: "Laura Fernández",
      date: "23 Oct 2025",
      rating: 5,
      comment: "Excelente farmacia, siempre con stock disponible. Personal muy atento a las dudas.",
      orderId: "REC-031",
      employeeName: "Farmacéutico: Roberto García",
    },
    {
      id: 6,
      customerName: "Roberto García",
      date: "22 Oct 2025",
      rating: 4,
      comment: "Muy buena atención, me ayudaron a encontrar alternativas más económicas.",
      orderId: "REC-028",
      employeeName: "Farmacéutico: Juan Pérez",
    },
    {
      id: 7,
      customerName: "Sofía López",
      date: "21 Oct 2025",
      rating: 5,
      comment: "Servicio rápido y eficiente. Precios competitivos.",
      orderId: "REC-025",
      employeeName: "Farmacéutico: Ana Martínez",
    },
    {
      id: 8,
      customerName: "Diego Martín",
      date: "20 Oct 2025",
      rating: 4,
      comment: "Buena atención, farmacia bien ubicada.",
      orderId: "REC-022",
      employeeName: "Farmacéutico: Luis Fernández",
    },
  ];

  const averageRating = 4.7;
  const totalRatings = 328;
  
  const ratingDistribution = [
    { stars: 5, count: 276, percentage: 84 },
    { stars: 4, count: 42, percentage: 13 },
    { stars: 3, count: 8, percentage: 2 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const employeeStats = [
    { name: "Juan Pérez", rating: 4.9, reviews: 89 },
    { name: "Ana Martínez", rating: 4.8, reviews: 76 },
    { name: "Luis Fernández", rating: 4.7, reviews: 68 },
    { name: "Laura Sánchez", rating: 4.6, reviews: 55 },
    { name: "Roberto García", rating: 4.7, reviews: 40 },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-3xl font-semibold mb-2">Calificaciones de la Farmacia</h2>
        <p className="text-emerald-50">Visualiza las valoraciones y comentarios de los clientes</p>
      </div>

      {/* Rating Overview - Solo Average Rating */}
      <Card className="border-2 border-yellow-200">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Star className="h-10 w-10 text-white fill-white" />
            </div>
            <p className="text-4xl font-bold text-yellow-600 mb-1">{averageRating}</p>
            <div className="flex justify-center mb-2">
              {renderStars(5)}
            </div>
            <p className="text-sm text-gray-600">Promedio de {totalRatings} calificaciones</p>
          </div>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card className="border-2 border-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-emerald-600" />
            Distribución de Calificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-4">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-medium">{item.stars}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <Progress value={item.percentage} className="flex-1 h-3" />
              <span className="text-sm text-gray-600 w-24 text-right">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Opiniones de Usuarios */}
      <Card className="border-2 border-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            Opiniones de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {ratings.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-emerald-900">{review.customerName}</p>
                      <p className="text-sm text-gray-600">{review.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}