import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Clock } from "lucide-react";

export default function DisplayPanel() {
  const [, setLocation] = useLocation();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Get access token from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  // Get establishment data
  const { data: establishment } = trpc.establishment.public.getOrder.useQuery(
    { accessToken: accessToken || "" },
    { enabled: !!accessToken }
  );

  // Get orders with auto-refresh
  const { data: orders = [], refetch } = trpc.establishment.orders.list.useQuery(
    undefined,
    { enabled: false }
  );

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetch();
    }, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, refetch]);

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">Acesso não encontrado</p>
          <button
            onClick={() => setLocation("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const preparingOrders = orders.filter((o: any) => o.status === "preparing");
  const readyOrders = orders.filter((o: any) => o.status === "ready");

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-6 px-8">
        <h1 className="text-5xl font-bold">MINHA FILA</h1>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Preparing Section */}
        <div className="flex-1 bg-gradient-to-b from-yellow-600 to-yellow-700 p-8 border-r-8 border-black flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <Clock className="w-12 h-12 text-white" />
            <h2 className="text-4xl font-bold text-white">PREPARANDO</h2>
          </div>

          {/* Preparing Orders Grid */}
          <div className="flex-1 grid grid-cols-2 gap-6 auto-rows-max">
            {preparingOrders.length === 0 ? (
              <div className="col-span-2 flex items-center justify-center">
                <p className="text-2xl text-white opacity-50">Nenhum pedido</p>
              </div>
            ) : (
              preparingOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="bg-white text-black rounded-lg p-6 shadow-2xl transform hover:scale-105 transition-transform"
                >
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-2">SENHA</p>
                    <p className="text-6xl font-bold text-yellow-600">
                      {order.ticketNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ready Section */}
        <div className="flex-1 bg-gradient-to-b from-green-600 to-green-700 p-8 flex flex-col">
          <div className="flex items-center gap-4 mb-8">
            <CheckCircle2 className="w-12 h-12 text-white" />
            <h2 className="text-4xl font-bold text-white">PRONTOS</h2>
          </div>

          {/* Ready Orders Grid */}
          <div className="flex-1 grid grid-cols-2 gap-6 auto-rows-max">
            {readyOrders.length === 0 ? (
              <div className="col-span-2 flex items-center justify-center">
                <p className="text-2xl text-white opacity-50">Nenhum pedido</p>
              </div>
            ) : (
              readyOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="bg-white text-black rounded-lg p-6 shadow-2xl transform hover:scale-105 transition-transform animate-pulse"
                >
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-2">SENHA</p>
                    <p className="text-6xl font-bold text-green-600">
                      {order.ticketNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="bg-black border-t-4 border-gray-700 px-8 py-4 flex justify-between items-center">
        <div className="text-gray-400 text-sm">
          Preparando: {preparingOrders.length} | Prontos: {readyOrders.length}
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-4 py-2 rounded text-sm font-semibold ${
            autoRefresh
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } text-white`}
        >
          {autoRefresh ? "Auto-atualizar: ON" : "Auto-atualizar: OFF"}
        </button>
      </div>
    </div>
  );
}
