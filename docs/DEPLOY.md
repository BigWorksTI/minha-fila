# Deploy

Backend (VPS + Traefik)
1) Criar rede externa do Traefik (uma vez): `docker network create traefik`
2) Ajustar `.env` conforme `docs/ENVIRONMENT.md`
3) Revisar labels/hosts no `docker-compose.yml`
4) Subir: `docker compose up -d --build`
5) Gerar `APP_KEY`: `docker compose exec app php artisan key:generate`
6) Migrar DB: `docker compose exec app php artisan migrate --seed`
7) Verificar logs: `docker compose logs -f --tail=200`

Frontend (Vercel)
- Conectar repo do frontend, configurar envs (URL da API, etc.)
- Build padrão do Next.js (Node LTS)

Observações
- Certifique-se de que o resolver ACME (`letsencrypt`) do Traefik tem storage configurado no host do Traefik.
- Monitore saúde dos serviços (`depends_on` + healthchecks).


