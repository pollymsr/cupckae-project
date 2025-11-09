# Cupcakepit — Vercel Ready (Fullstack)

Este repositório foi ajustado para deploy fullstack (Vite frontend + Express backend) e já inclui endpoints de exemplo para testar a integração com MongoDB.

## Como usar localmente

1. Instale dependências (recomendo pnpm):
```bash
npm install -g pnpm
pnpm install
```

2. Crie um `.env` na raiz copiando `.env.example` e preenchendo `DATABASE_URL`:
```
cp .env.example .env
# editar .env e colocar sua string MongoDB em DATABASE_URL
```

3. Rodar em modo dev (frontend + backend):
```bash
pnpm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000 (ex.: /api/health, /api/products)

## Endpoints disponíveis

- `GET /api/health` — checagem de saúde
- `GET /api/products` — lista produtos (até 100)
- `POST /api/products` — cria um produto (payload JSON, ver exemplo abaixo)

### Modelo Product (server/models.ts)
```ts
{
  name: string;           // obrigatório
  description?: string;
  price: number;          // obrigatório
  image?: string;
  category?: string;
  available: boolean;     // default true
}
```

## Exemplos de teste (cURL)

Listar produtos:
```bash
curl -X GET http://localhost:3000/api/products
```

Criar produto:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Cupcake de Baunilha","description":"Macio e leve","price":9.9,"image":"/images/vanilla.jpg","category":"Tradicional","available":true}'
```

## Testar no Vercel (deploy)

- Assegure que em **Settings → Environment Variables** do projeto Vercel você adicionou `DATABASE_URL` com a string do MongoDB.
- Root Directory: deixe em branco (usar raiz do repositório).
- Build Command: `pnpm run build`
- Output Directory: `dist`

Após deploy, você poderá chamar:
```bash
curl -X GET https://cupcakepit.vercel.app/api/products
```

## Postman
Importe as rotas usando os endpoints acima. Para criar um produto, envie um POST com `Content-Type: application/json` e o JSON do produto.

---
