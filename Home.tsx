import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { ShoppingCart, Star, LogIn } from "lucide-react";
import { useTestAuth } from "@/context/TestAuthContext";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { loginAsTestUser } = useTestAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {APP_TITLE}
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/menu">
              <Button variant="ghost">Cardápio</Button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost">Meu Perfil</Button>
                </Link>
                <Link href="/orders">
                  <Button variant="ghost">Meus Pedidos</Button>
                </Link>
                <Link href="/checkout">
                  <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Carrinho
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex gap-2">
                <a href={getLoginUrl()}>
                  <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
                    Entrar
                  </Button>
                </a>
                <Button
                  onClick={() => {
                    loginAsTestUser();
                    window.location.reload();
                  }}
                  variant="outline"
                  className="border-pink-300 text-pink-600 hover:bg-pink-50"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Teste
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Bem-vindo à Polly's Cupcakes
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Descubra os cupcakes mais deliciosos da região. Feitos com ingredientes frescos e muito amor.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8">
                Ver Cardápio
              </Button>
            </Link>
            {!isAuthenticated && (
              <Button
                onClick={() => {
                  loginAsTestUser();
                  window.location.reload();
                }}
                size="lg"
                variant="outline"
                className="px-8"
              >
                Criar Conta (Teste)
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 border-t border-pink-100">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Por que escolher Polly's?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">Qualidade Premium</h4>
              <p className="text-gray-600">Ingredientes selecionados e receitas exclusivas</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">Entrega Rápida</h4>
              <p className="text-gray-600">Rastreamento em tempo real do seu pedido</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">Sabores Variados</h4>
              <p className="text-gray-600">Mais de 10 sabores diferentes para escolher</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto para saborear?</h3>
          <p className="text-lg mb-8 opacity-90">Confira nossos deliciosos cupcakes e faça seu pedido agora!</p>
          <Link href="/menu">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 px-8">
              Explorar Cardápio
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Polly's Cupcakes. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
