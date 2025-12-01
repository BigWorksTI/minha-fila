import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

export default function CustomerOrder() {
  const [, setLocation] = useLocation();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Get access token from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const { data: order, isLoading, error } = trpc.establishment.public.getOrder.useQuery(
    { accessToken: accessToken || "" },
    { enabled: !!accessToken }
  );

  const { data: orderItems } = trpc.establishment.public.getOrderItems.useQuery(
    { orderId: order?.id || 0 },
    { enabled: !!order?.id }
  );

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Minha Fila</CardTitle>
            <CardDescription>Acesso ao pedido não encontrado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Escaneie o código QR ou acesse o link fornecido para visualizar seu pedido.
            </p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Pedido não encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Desculpe, não conseguimos encontrar seu pedido. Verifique o link e tente novamente.
            </p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isReady = order.status === "ready";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Status Card */}
        <Card className={`mb-6 border-2 ${isReady ? "border-green-500 bg-green-50" : "border-yellow-500 bg-yellow-50"}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isReady ? (
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              ) : (
                <Clock className="w-16 h-16 text-yellow-600 animate-pulse" />
              )}
            </div>
            <CardTitle className={`text-3xl font-bold ${isReady ? "text-green-600" : "text-yellow-600"}`}>
              Senha #{order.ticketNumber}
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              {isReady ? "Seu pedido está pronto!" : "Seu pedido está sendo preparado"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Order Items */}
        {orderItems && orderItems.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-2 border-b last:border-b-0">
                    <span className="text-gray-700">Item #{item.productId}</span>
                    <span className="font-semibold text-gray-900">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        {isReady && (
          <Card className="bg-green-100 border-green-300">
            <CardContent className="pt-6">
              <p className="text-center text-green-800 font-semibold mb-4">
                Dirija-se ao balcão para retirar seu pedido
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Confirmar Retirada
              </Button>
            </CardContent>
          </Card>
        )}

        {!isReady && (
          <Card className="bg-blue-100 border-blue-300">
            <CardContent className="pt-6">
              <p className="text-center text-blue-800 text-sm">
                Você receberá uma notificação quando seu pedido estiver pronto
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
