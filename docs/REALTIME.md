# Realtime

Canal
- `shop.{id}.orders`

Evento
- `OrderUpdated`

Payload (exemplo)
{
  "id": 10,
  "status": "ready",
  "sequence_id": 124,
  "updated_at": "2025-01-10 14:33"
}

Cliente (Echo)
- Conectar no Soketi (Pusher‑compatible) com chaves do `.env`
- Reassociar no reconnect, revalidando estado via API se `sequence_id` estiver defasado

Servidor (Laravel)
- Disparar `broadcast(new OrderUpdated($order))` após persistência e atualização de cache
- Separar canais por estabelecimento para evitar vazamento de eventos


