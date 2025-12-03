# Arquitetura

Frontend (Vercel)
- Next.js 14 (App Router), TypeScript, Tailwind, PWA
- SWR/React Query para cache/sincronização
- Echo (Pusher client) para WebSockets (via Soketi)

Backend (VPS + Traefik)
- Laravel 10/11 (PHP‑FPM)
- PostgreSQL 15 (dados)
- Redis 7 (cache, filas, pub/sub)
- Soketi (Pusher‑compatible WebSocket)
- Orquestração com Docker Compose e reverse proxy com Traefik (TLS ACME)

Comunicação
- REST para CRUD e relatórios
- WebSockets para atualização em tempo real (eventos broadcast do Laravel)
- Autenticação: token (Sanctum ou Bearer) conforme rotas privadas

Pontos de atenção
- Reconnect resiliente: cliente revalida estado via SWR se perder eventos
- `sequence_id` para assegurar ordenação/consistência
- Canais por estabelecimento: `shop.{id}.orders`


