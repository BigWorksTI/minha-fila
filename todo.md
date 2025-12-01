# Minha Fila - TODO

## MVP - Funcionalidades Essenciais

### Estrutura de Dados & Backend
- [x] Criar schema do banco de dados (Estabelecimento, Pedido, Produto)
- [x] Configurar autenticação de usuários (Estabelecimento)
- [x] Criar API REST para gerenciar pedidos
- [ ] Implementar geração de QR Code para acesso do cliente

### Painel do Estabelecimento
- [x] Dashboard principal com lista de pedidos
- [x] Botões para mudar status do pedido (PREPARANDO / PRONTO)
- [ ] Cadastro rápido de produtos
- [ ] Visualização do histórico de pedidos
- [ ] Estatísticas simples (tempo médio de preparo, pico de pedidos)
- [x] Responsividade para smartphone e notebook

### Interface do Cliente (PWA)
- [x] Página de acesso via QR Code / Link
- [x] Visualização em tempo real do status do pedido (PREPARANDO / PRONTO)
- [ ] Notificação silenciosa quando status muda
- [x] Design limpo e responsivo para smartphone
- [ ] PWA com offline capability básico

### Painel para TV (Opcional)
- [x] Painel grande estilo Madero (PRONTOS / PREPARANDO)
- [x] Atualização em tempo real
- [x] Design otimizado para telas grandes
- [x] Modo dark para TVs

### Testes & Deploy
- [ ] Testes unitários (vitest)
- [ ] Testes de integração
- [ ] Testes de usabilidade em smartphone
- [ ] Deploy e publicação
