import { Star, TrendingUp, Award, ThumbsUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function RatingsScreen() {
  const ratings = [
    {
      id: 1,
      customerName: "María González",
      date: "24 Oct 2025",
      rating: 5,
      comment: "Excelente servicio! El repartidor fue muy amable y rápido. Llegó antes del tiempo estimado.",
      orderId: "PED-045",
    },
    {
      id: 2,
      customerName: "Carlos Rodríguez",
      date: "23 Oct 2025",
      rating: 5,
      comment: "Muy profesional, manejó con cuidado los medicamentos. ¡Recomendado!",
      orderId: "PED-042",
    },
    {
      id: 3,
      customerName: "Ana Martínez",
      date: "22 Oct 2025",
      rating: 4,
      comment: "Buen servicio, llegó a tiempo. Todo perfecto.",
      orderId: "PED-038",
    },
    {
      id: 4,
      customerName: "Juan Pérez",
      date: "21 Oct 2025",
      rating: 5,
      comment: "Increíble atención, muy cordial y puntual. Gracias!",
      orderId: "PED-035",
    },
    {
      id: 5,
      customerName: "Laura Fernández",
      date: "20 Oct 2025",
      rating: 4,
      comment: "Todo bien, servicio rápido y eficiente.",
      orderId: "PED-031",
    },
  ];

  const averageRating = 4.8;
  const totalRatings = 156;
  
  const ratingDistribution = [
    { stars: 5, count: 132, percentage: 85 },
    { stars: 4, count: 18, percentage: 12 },
    { stars: 3, count: 4, percentage: 2 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 0, percentage: 0 },
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
        <h2 className="text-3xl font-semibold mb-2">Mis Calificaciones</h2>
        <p className="text-emerald-50">Visualiza tus calificaciones y comentarios de clientes</p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average Rating Card */}
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

        {/* Performance Card */}
        <Card className="border-2 border-emerald-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <p className="text-4xl font-bold text-emerald-600 mb-1">+0.3</p>
              <p className="text-sm text-gray-600 mb-2">vs. mes anterior</p>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                ↑ Mejorando
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Card */}
        <Card className="border-2 border-teal-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="h-10 w-10 text-white" />
              </div>
              <p className="text-4xl font-bold text-teal-600 mb-1">Top 5%</p>
              <p className="text-sm text-gray-600 mb-2">Repartidores destacados</p>
              <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">
                Excelente
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <span className="text-sm text-gray-600 w-16 text-right">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card className="border-2 border-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-600" />
            Comentarios Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                    {review.orderId}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic">"{review.comment}"</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
