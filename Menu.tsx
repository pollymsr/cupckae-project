import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/context/CartContext";

export default function Menu() {
  const { data: cupcakes, isLoading } = trpc.cupcakes.list.useQuery();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());

  const handleAddToCart = (cupcake: any) => {
    addToCart({
      id: cupcake._id,
      name: cupcake.name,
      price: cupcake.price, // Preço já está em R$ (float) no novo modelo
      image: cupcake.image,
      quantity: 1,
    });
    
    setAddedItems(prev => new Set(Array.from(prev).concat(cupcake._id)));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(cupcake._id);
        return newSet;
      });
    }, 1500);
  };

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
            <h1 className="text-2xl font-bold">Cardápio</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost">Perfil</Button>
            </Link>
            <Link href="/checkout">
              <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Menu Grid */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Nossos Cupcakes</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cupcakes?.map((cupcake: any) => (
              <Card key={cupcake._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-pink-200 to-purple-200 h-48 flex items-center justify-center text-4xl">
                  🧁
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{cupcake.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{cupcake.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">
                      R$ {cupcake.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(cupcake)}
                      className={`${
                        addedItems.has(cupcake._id)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
