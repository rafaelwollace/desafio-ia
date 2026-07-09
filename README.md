# Gestão de Projetos

Aplicação fullstack para cadastro e acompanhamento de projetos.

**Stack:** React + TypeScript (frontend) · NestJS + TypeScript (backend)

## Como rodar

### Docker (recomendado)

```bash
docker compose up --build
```

| Serviço   | URL                              |
|-----------|----------------------------------|
| Frontend  | http://localhost:8080            |
| Swagger   | http://localhost:8080/api/docs   |

> A API fica acessível via proxy no frontend (porta 8080), sem expor a 3000 no host.

### Local (sem Docker)

**Backend**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend** (outro terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend em http://localhost:5173 · API em http://localhost:3000

## O que a aplicação faz

- CRUD de projetos com cálculo automático de risco
- Controle de transição de status e bloqueio de exclusão
- Análise textual do projeto com IA (mock por padrão, OpenAI opcional)
- Documentação da API via Swagger

## IA com OpenAI (opcional)

Crie um `.env` na raiz do projeto ou configure `backend/.env`:

```env
OPENAI_API_KEY=sua-chave-aqui
```

## Testes

```bash
cd backend
npm test
```

## Documentação de IA

Detalhes sobre o uso de Inteligência Artificial no desenvolvimento: [AI_USAGE.md](./AI_USAGE.md)
