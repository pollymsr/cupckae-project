import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    zip: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      alert(`Pedido #${data.orderId} criado com sucesso!`);
      clearCart();
      window.location.href = '/orders';
    },
    onError: (error) => {
      alert(`Erro ao criar pedido: ${error.message}`);
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = "Nome é obrigatório";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email válido é obrigatório";
    }
    if (!formData.address) newErrors.address = "Endereço é obrigatório";
    if (!formData.city) newErrors.city = "Cidade é obrigatória";
    if (!formData.zip) newErrors.zip = "CEP é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || cart.length === 0) {
      alert("Preencha todos os campos e adicione itens ao carrinho");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createOrderMutation.mutateAsync({
        total: total,
        paymentMethod,
        customerName: formData.name,
        customerEmail: formData.email,
        customerAddress: formData.address,
        customerCity: formData.city,
        customerZip: formData.zip,
        items: cart.map(item => ({ name: item.name,
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Link href="/menu">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-gray-600 mb-6">Seu carrinho está vazio</p>
          <Link href="/menu">
            <Button className="bg-gradient-to-r from-pink-500 to-pink-600">
              Voltar ao Cardápio
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
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/menu">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Order Summary */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Resumo do Pedido</h2>
          <div className="space-y-3 mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-pink-600">R$ {total.toFixed(2)}</span>
          </div>
        </Card>

        {/* Delivery Form */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Informações de Entrega</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Endereço</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.address ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cidade</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.city ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CEP</label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.zip ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">Método de Pagamento</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit")}
                  className={`p-4 border-2 rounded-lg ${paymentMethod === "credit" ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}
                >
                  💳 Cartão de Crédito
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`p-4 border-2 rounded-lg ${paymentMethod === "pix" ? "border-pink-500 bg-pink-50" : "border-gray-300"}`}
                >
                  📱 PIX
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 text-lg font-bold mt-6"
            >
              {isSubmitting ? "Processando..." : "Finalizar Pedido"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
