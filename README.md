# Kidsflow

Plataforma de cadastro para evento de Dia das Criancas.

## Requisitos
- Node.js 20+
- PostgreSQL
- Conta Clerk

## Configuracao
1. Copie `.env.example` para `.env`.
2. Preencha as chaves do Clerk e `DATABASE_URL`.
3. Instale dependencias:

```bash
npm install
```

4. Gere o client Prisma:

```bash
npx prisma generate
```

5. Rode migracoes:

```bash
npx prisma migrate dev --name init
```

6. Inicie ambiente local:

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
