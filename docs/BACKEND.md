# Backend (Laravel)

Objetivo
- API REST + eventos broadcast em tempo real
- Persistência em PostgreSQL, cache/filas com Redis, WebSocket via Soketi

Estrutura (prevista)
app/
  Events/
    OrderUpdated.php
  Models/
    Order.php
    Company.php
    UserProvider.php
  Http/Controllers/
    OrderController.php
    AuthController.php
    CompanyController.php
  Http/Resources/
    OrderResource.php
    CompanyResource.php
database/
  migrations/
  seeders/
routes/
  api.php
config/
  broadcasting.php
  queue.php

Autenticação e Identidade
- OAuth Google/Apple; unificação por e‑mail (sem duplicar usuário).
- `user_providers`: mapeia `user_id` para `{provider, provider_id}`.
- Primeiro acesso: se o usuário não possui empresa → criar empresa com UUID curto e redirecionar ao admin.

Modelo de Dados (resumo)
- `users (uuid)`, `user_providers (user_id, provider, provider_id, created_at)`.
- `companies (uuid_curto, owner_id, name, created_at)`.
- `orders (uuid, company_id, number, description, status(waiting|preparing|ready|done), sequence_id BIGSERIAL, timestamps)`.
- `order_sequences (company_id, current_number)` para numeração sequencial por empresa.

Rotas (conceito)
- Público: `/[uuid]` (fila); Privado: `/[uuid]/admin`, `/[uuid]/admin/config`.
- API:
  - `POST /api/companies/{uuid}/orders` (criar)
  - `GET /api/companies/{uuid}/orders` (listar)
  - `PATCH /api/orders/{id}` (status)
  - `GET /api/companies/{uuid}/orders/changes?since=...`
  - `POST /api/companies/{uuid}/reset-sequence` (admin)
  - `GET /api/health`

Pacotes recomendados
- laravel/sanctum (auth por token simples, se necessário)
- predis/predis ou php-redis (extensão)
- pusher/pusher-php-server (se for útil para debug)

Broadcasting
- `BROADCAST_DRIVER=pusher` no `.env`
- Configurar chaves/host do Soketi em `config/broadcasting.php` (via env)
- Evento `OrderUpdated` deve implementar `ShouldBroadcast`

Fila/Scheduler
- Worker: `queue` (compose)
- Scheduler: `schedule:run` a cada 60s (compose)

Comandos úteis
- Gerar key: `php artisan key:generate`
- Migrações: `php artisan migrate --seed`
- Testes: `php artisan test`


