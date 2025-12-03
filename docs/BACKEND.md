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
  Http/Controllers/
    OrderController.php
  Http/Resources/
    OrderResource.php
database/
  migrations/
  seeders/
routes/
  api.php
config/
  broadcasting.php
  queue.php

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


