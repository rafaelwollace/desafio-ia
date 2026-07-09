# Uso de Inteligência Artificial

## Ferramenta

- **Cursor IDE** com assistente de IA integrado (Claude)

## Onde usei IA

| Área | Como foi usada |
|------|----------------|
| Estrutura do projeto | Organização de pastas, scaffold NestJS e React |
| Backend | Endpoints, DTOs, validações, módulo de IA e testes |
| Regras de negócio | Cálculo de risco, transição de status, bloqueio de exclusão |
| Frontend | Componentes, formulários, modais e integração com a API |
| Docker | Dockerfiles e docker-compose |
| Documentação | Rascunho inicial do README |

## Prompts que usei

- Pedir a estrutura da API NestJS com controller, service, repository, DTOs e Swagger
- Pedir a implementação das regras de risco e transição de status conforme o enunciado
- Pedir o frontend com listagem, formulário, detalhes e painel de análise IA
- Pedir Docker Compose para subir backend e frontend juntos
- Revisar e corrigir erros de build apontados pelo compilador

## O que mantive, ajustei ou descartei

**Mantive**
- Repositório em memória (simples e suficiente para o escopo)
- Camada de IA separada (`AiAnalysisService`, `AiClient`, `ProjectAnalysisPromptBuilder`)
- Mock como padrão, com suporte opcional à OpenAI via variável de ambiente

**Ajustei**
- Lógica de risco: corrigi para aplicar todas as regras e prevalecer o maior risco
- Transição de status: garanti que cancelamento funciona de qualquer status, mas sem pular etapas
- Fallback de IA: se a OpenAI falhar, o sistema usa o mock automaticamente
- Imports e tipos que quebravam o build em produção

**Descartei**
- Autenticação e banco de dados (fora do escopo)
- Bibliotecas de UI externas — preferi CSS próprio para manter leve
- Testes e2e extensivos

## Decisões minhas

1. Persistência em memória com seed de 2 projetos de exemplo
2. TypeScript em frontend e backend
3. Validação dupla: frontend (UX) + backend (class-validator)
4. Swagger em `/api/docs`
5. Docker com Nginx servindo o frontend buildado

## Limitações

- Dados se perdem ao reiniciar o backend
- IA real depende de chave OpenAI configurada
- Sem autenticação, deploy ou design elaborado
- Testes cobrem apenas as regras principais (risco e status)

## Revisão

Usei IA principalmente para acelerar boilerplate e estrutura inicial. Revisei manualmente as regras de negócio, testei os endpoints, corrigi erros de build e tomei as decisões de arquitetura descritas acima.
