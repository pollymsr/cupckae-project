import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Package } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const { data: orders, isLoading } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "⏳ Pendente",
      processing: "⚙️ Em Processamento",
      shipped: "🚚 Enviado",
      delivered: "✅ Entregue",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <h1 className="text-2xl font-bold">Meus Pedidos</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-gray-600 mb-6">Você precisa estar logado para ver seus pedidos</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-pink-500 to-pink-600">
              Voltar para Home
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Meus Pedidos</h1>
          </div>
          <Link href="/menu">
            <Button className="bg-gradient-to-r from-pink-500 to-pink-600">
              Novo Pedido
            </Button>
          </Link>
        </div>
      </header>

      {/* Orders List */}
      <main className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Pedido #{order._id.slice(-6)}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Cliente</p>
                    <p className="font-medium">{order.userName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Método de Pagamento</p>
                    <p className="font-medium">{order.paymentMethod === "credit" ? "Cartão de Crédito" : "PIX"}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Endereço</p>
                    <p className="font-medium">{order.customerCity}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="font-bold text-pink-600">R$ {order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Itens do Pedido</p>
                  <p className="text-sm text-gray-700">
                    {order.items?.length || 0} item(ns) no pedido
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">Você ainda não tem pedidos</p>
            <Link href="/menu">
              <Button className="bg-gradient-to-r from-pink-500 to-pink-600">
                Fazer Primeiro Pedido
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
