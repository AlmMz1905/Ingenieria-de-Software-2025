import { Star, TrendingUp, Award, ThumbsUp, MessageSquare, Store, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

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
              <p className="text-4xl font-bold text-emerald-600 mb-1">+0.2</p>
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
              <p className="text-4xl font-bold text-teal-600 mb-1">97%</p>
              <p className="text-sm text-gray-600 mb-2">Satisfacción del cliente</p>
              <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200">
                Excelente
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Employee Performance */}
        <Card className="border-2 border-emerald-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Rendimiento por Empleado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {employeeStats.map((employee, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl border border-emerald-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-xs text-gray-600">{employee.reviews} valoraciones</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-yellow-600">{employee.rating}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

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
                  <p className="text-xs text-teal-600 mt-1">{review.employeeName}</p>
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

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Store className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tiempo promedio de atención</p>
                <p className="text-xl font-semibold text-emerald-900">8 minutos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-teal-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <ThumbsUp className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recomendarían la farmacia</p>
                <p className="text-xl font-semibold text-teal-900">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-cyan-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Comentarios este mes</p>
                <p className="text-xl font-semibold text-cyan-900">86</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
