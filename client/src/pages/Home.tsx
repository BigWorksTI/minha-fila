import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2, QrCode, BarChart3, Zap } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && !loading) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minha Fila</h1>
            <p className="text-sm text-gray-600">Organize suas filas com inteligência</p>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transforme a Experiência de Seus Clientes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize filas virtuais, aumente a satisfação dos clientes e melhore a eficiência do seu estabelecimento com Minha Fila.
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
          >
            Começar Agora
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>QR Code Simples</CardTitle>
              <CardDescription>
                Clientes geram senhas com um simples scan do QR Code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Sem app, sem complicação. Apenas um QR Code impresso no seu estabelecimento.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Tempo Real</CardTitle>
              <CardDescription>
                Atualizações instantâneas do status do pedido
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Seus clientes sabem exatamente quando o pedido estará pronto.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Acompanhe métricas importantes do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Tempo médio de preparo, pico de pedidos e muito mais.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-2xl">Por que escolher Minha Fila?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Pareça profissional:</strong> Seus clientes confiam mais em estabelecimentos organizados
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Aumente vendas:</strong> Clientes que veem organização compram mais
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Zero equipamento caro:</strong> Use seu smartphone ou notebook
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 font-bold">✓</span>
                <span className="text-gray-700">
                  <strong>Configuração em 5 minutos:</strong> Comece agora, sem burocracia
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; 2024 Minha Fila. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
