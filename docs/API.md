# API (MVP Atualizado)

## Autenticação
- Login via Google/Apple (OAuth). Unificação por e‑mail (sem duplicar usuário).
- Tabela de apoio: `user_providers (user_id, provider, provider_id)`.
- Rotas administrativas exigem token (Sanctum/Bearer).

## Endpoints

### Health
GET /api/health
Resposta:
{ "status": "ok" }

### Criar pedido (empresa por UUID curto)
POST /api/companies/{uuid}/orders
Body:
{
  "label": "Crepe de frango"
}

Resposta (201):
{
  "id": 10,
  "company_uuid": "fk29ad",
  "label": "Crepe de frango",
  "status": "waiting", // waiting | preparing | ready | done
  "sequence_id": 123,
  "created_at": "...",
  "updated_at": "..."
}

### Atualizar status
PATCH /api/orders/{id}
Body:
{ "status": "preparing" }  // waiting | preparing | ready | done

Resposta (200):
{
  "id": 10,
  "status": "preparing",
  "sequence_id": 124,
  "updated_at": "..."
}

### Listar pedidos atuais
GET /api/companies/{uuid}/orders

Resposta (200):
[
  { "id": 9, "status": "ready", ... },
  { "id": 10, "status": "preparing", ... }
]

### Alterações desde um ponto (long polling)
GET /api/companies/{uuid}/orders/changes?since=123

Resposta (200):
[
  { "id": 10, "status": "ready", "sequence_id": 124, "updated_at": "..." }
]

### Resetar numeração (admin)
POST /api/companies/{uuid}/reset-sequence
Resposta (200):
{ "ok": true, "current_number": 0 }

Observações
- `sequence_id` deve ser monotônico crescente.
- Padrão de erro: JSON com `message`, `errors?`, `code?`.

Modelos (resumo)
- users: `id(uuid), name, email, ...`
- user_providers: `id, user_id, provider(google|apple), provider_id, created_at`
- companies: `id(uuid curto), owner_id(user), name, created_at`
- orders: `id(uuid), company_id, number(sequencial), description, status(waiting|preparing|ready|done), sequence_id(BIGSERIAL), created_at, updated_at`
- order_sequences: `company_id, current_number`


