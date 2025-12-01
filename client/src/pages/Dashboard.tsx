import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { CheckCircle2, Clock, LogOut, Plus } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [newTicketNumber, setNewTicketNumber] = useState("");

  // Get establishment data
  const { data: establishment } = trpc.establishment.getMe.useQuery();

  // Get orders
  const { data: orders = [], refetch: refetchOrders } = trpc.establishment.orders.list.useQuery();

  // Create order mutation
  const createOrderMutation = trpc.establishment.orders.create.useMutation({
    onSuccess: () => {
      setNewTicketNumber("");
      refetchOrders();
    },
  });

  // Update order status mutation
  const updateStatusMutation = trpc.establishment.orders.updateStatus.useMutation({
    onSuccess: () => {
      refetchOrders();
    },
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketNumber.trim()) return;

    await createOrderMutation.mutateAsync({
      ticketNumber: newTicketNumber,
    });
  };

  const handleUpdateStatus = async (orderId: number, status: "preparing" | "ready") => {
    await updateStatusMutation.mutateAsync({
      orderId,
      status,
    });
  };

  const preparingOrders = orders.filter((o: any) => o.status === "preparing");
  const readyOrders = orders.filter((o: any) => o.status === "ready");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Minha Fila</h1>
            {establishment && (
              <p className="text-sm text-slate-600">{establishment.name}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.name || user?.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Create Order Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gerar Nova Senha</CardTitle>
            <CardDescription>
              Crie uma nova senha para o cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrder} className="flex gap-2">
              <Input
                type="text"
                placeholder="Número da senha (ex: 001)"
                value={newTicketNumber}
                onChange={(e) => setNewTicketNumber(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Gerar Senha
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preparing Orders */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Preparando ({preparingOrders.length})
            </h2>
            <div className="space-y-3">
              {preparingOrders.length === 0 ? (
                <Card className="bg-slate-50">
                  <CardContent className="pt-6">
                    <p className="text-center text-slate-600 text-sm">
                      Nenhum pedido em preparação
                    </p>
                  </CardContent>
                </Card>
              ) : (
                preparingOrders.map((order: any) => (
                  <Card key={order.id} className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-yellow-900">
                            #{order.ticketNumber}
                          </h3>
                          <p className="text-xs text-yellow-700">
                            {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleUpdateStatus(order.id, "ready")}
                        disabled={updateStatusMutation.isPending}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Marcar como Pronto
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Prontos ({readyOrders.length})
            </h2>
            <div className="space-y-3">
              {readyOrders.length === 0 ? (
                <Card className="bg-slate-50">
                  <CardContent className="pt-6">
                    <p className="text-center text-slate-600 text-sm">
                      Nenhum pedido pronto
                    </p>
                  </CardContent>
                </Card>
              ) : (
                readyOrders.map((order: any) => (
                  <Card key={order.id} className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-2xl font-bold text-green-900">
                            #{order.ticketNumber}
                          </h3>
                          <p className="text-xs text-green-700">
                            {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
                          </p>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
