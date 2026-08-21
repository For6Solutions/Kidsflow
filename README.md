# Kidsflow

Plataforma de cadastro e operação para evento infantil: famílias, crianças, check-in e relatórios.

## Requisitos

- Node.js 20+
- PostgreSQL
- Conta Clerk com uma instância configurada

## Configuração local

1. Copie `.env.example` para `.env`.
2. Preencha as chaves do Clerk e `DATABASE_URL`.
3. Instale as dependências:

```bash
npm install
```

4. Gere o client Prisma:

```bash
npx prisma generate
```

5. Crie/aplique a migração inicial no banco:

```bash
npx prisma migrate dev --name init
```

6. Inicie o ambiente local:

```bash
npm run dev
```

## Modulos

- Login seguro com Clerk
- Cadastro por etapas (familia -> responsaveis -> criancas)
- Consulta de CEP via ViaCEP
- Check-in rapido
- Relatorios operacionais
- Exportacao CSV e PDF

## Endpoints

- GET `/api/search`
- GET `/api/viacep`
- POST `/api/families`
- POST `/api/checkin`
- GET `/api/dashboard/summary`
- GET `/api/export/csv`
- GET `/api/export/pdf`
- POST `/api/rsvp/reminders`

## Cloudflare Pages / Workers

Este projeto é SSR e possui APIs protegidas; ele não pode ser publicado como **Next.js (Static HTML Export)**. A configuração atual usa OpenNext e o runtime de Worker (`wrangler.jsonc` aponta para `.open-next/worker.js`). No produto Cloudflare, use Workers Builds dentro de Workers & Pages ou o fluxo de deploy do OpenNext.

Para uma build compatível com o Cloudflare:

```bash
npm run cf:build
```

Para testar o runtime real localmente:

```bash
cp .dev.vars.example .dev.vars
npm run preview
```

Configure no Cloudflare:

- **Build variables/secrets:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e as variáveis `NEXT_PUBLIC_CLERK_*` usadas pela aplicação.
- **Runtime variables/secrets:** `CLERK_SECRET_KEY` e `DATABASE_URL`.
- `DATABASE_URL` deve apontar para um PostgreSQL acessível pelo Cloudflare. Para reduzir latência e estabilizar conexões, use Hyperdrive quando disponível.

O arquivo `.env.example` serve para `next dev`; o `.dev.vars.example` serve para o preview do Wrangler. Não coloque chaves reais no repositório.
