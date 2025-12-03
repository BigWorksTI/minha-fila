# Overview

O Minha Fila é um sistema de fila virtual em tempo real para lanchonetes, creperias e pequenos fast‑foods. Substitui senhas de papel e chamadas por voz por um painel digital simples. O cliente acessa via QR code no balcão/mesa (PWA), e o estabelecimento administra pedidos e status em um painel web.

Benefícios
- Reduz desorganização e tempo de atendimento
- Melhora percepção de profissionalismo
- Não exige hardware adicional
- Mobile‑first, leve e responsivo

Público‑alvo (exemplos)
- Lanchonetes pequenas, carrinhos e food trucks
- Operações sazonais de praia

Funcionalidades (MVP)
- Admin: criar pedidos, alterar status (aguardando → preparando → pronto → entregue), painéis de cozinha e TV
- Cliente (PWA): ver senha/status em tempo real
- Sistema: WebSockets via Soketi, cache Redis, consistência com `sequence_id`


