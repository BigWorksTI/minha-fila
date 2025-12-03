# Frontend (Next.js)

Objetivo
- PWA mobile‑first para cliente e interfaces de admin/painéis

Stack
- Next.js 14 (App Router), TypeScript, Tailwind
- SWR/React Query
- Echo (Pusher client) para realtime

Estrutura (prevista)
src/
  app/
    layout.tsx
    page.tsx
    admin/
      page.tsx
      orders/
        page.tsx
    painel/
      page.tsx
    pedido/[id]/
      page.tsx
  components/
    OrderCard.tsx
    StatusBadge.tsx
  hooks/
    useOrders.ts
  lib/
    api.ts
    echo.ts
  styles/
    globals.css

Realtime
- Conectar Echo ao host do Soketi e assinar `shop.{id}.orders`
- Revalidar SWR ao receber `OrderUpdated`

Deploy
- Vercel com variáveis de ambiente (URLs da API e do Soketi, quando necessário)


