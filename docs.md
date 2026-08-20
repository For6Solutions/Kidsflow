# Kidsflow - Arquitetura do Projeto

## Stack
- Next.js 16 (App Router, TypeScript)
- Clerk (autenticacao de profissionais/admin)
- Prisma + PostgreSQL
- Zod + React Hook Form

## Estrutura de pastas
- src/app: rotas web e APIs
- src/components: componentes UI e formularios
- src/lib: utilitarios centrais (db, auth, validacao, rate limit)
- src/services: regras de negocio e agregacoes
- prisma: modelagem relacional e migracoes

## Fluxos implementados
- Login e rotas protegidas
- Cadastro por etapas (1 a 8)
- Busca com autocomplete (familia/responsavel/crianca)
- Integracao ViaCEP
- Check-in rapido
- Relatorios de resumo e exportacao CSV/PDF

## Segurança base
- Middleware com protecao por rota
- Validacao forte de payloads com Zod
- Rate limit em endpoints publicos sensiveis
- Headers de seguranca (CSP, X-Frame-Options, etc.)
- Queries com ORM (Prisma) para reduzir risco de injecao
