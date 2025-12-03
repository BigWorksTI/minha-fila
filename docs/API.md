# API (MVP)

## Autenticação
- Rotas administrativas podem exigir token (Sanctum/Bearer). Definir estratégia.

## Endpoints

### Criar pedido
POST /api/orders
Body:
{
  "shop_id": 1,
  "label": "Crepe de frango"
}

Resposta (201):
{
  "id": 10,
  "shop_id": 1,
  "label": "Crepe de frango",
  "status": "waiting",
  "sequence_id": 123,
  "created_at": "...",
  "updated_at": "..."
}

### Atualizar status
PATCH /api/orders/{id}
Body:
{ "status": "preparing" }  // waiting | preparing | ready | delivered

Resposta (200):
{
  "id": 10,
  "status": "preparing",
  "sequence_id": 124,
  "updated_at": "..."
}

### Listar pedidos atuais
GET /api/orders?shop=1

Resposta (200):
[
  { "id": 9, "status": "ready", ... },
  { "id": 10, "status": "preparing", ... }
]

### Alterações desde um ponto (long polling)
GET /api/orders/changes?since=123

Resposta (200):
[
  { "id": 10, "status": "ready", "sequence_id": 124, "updated_at": "..." }
]

Observações
- `sequence_id` deve ser monotônico crescente.
- Padrão de erro: JSON com `message`, `errors?`, `code?`.


