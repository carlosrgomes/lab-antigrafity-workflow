---
name: nodejs-backend
description: "Guidelines and utilities for structured, scalable, and safe Node.js backend development using TypeScript, routing patterns, DB ORM integration, and testing."
---

# Habilidade: Desenvolvimento de Backend Node.js

Esta skill define as melhores práticas que os agentes de desenvolvimento backend devem seguir ao codificar no projeto.

---

## 🛠️ Padrões Arquiteturais (API REST)

Recomendamos a separação lógica de responsabilidades baseada em Controllers, Services e Data Access layers:

1. **Roteamento & Validação (Router/Controller)**:
   * A rota apenas recebe a chamada e aciona o controller.
   * O controller valida a entrada de dados imediatamente antes de prosseguir usando schemas (ex: Zod).
   
2. **Camada de Regras de Negócio (Services/Use Cases)**:
   * Toda a lógica, cálculos e fluxos de negócio residem em classes de serviço.
   * Os serviços são independentes do protocolo de transporte (não dependem de objetos `req` ou `res` do Express/Fastify).

3. **Camada de Acesso a Dados (Repositories/Models)**:
   * Abstração de queries ou operações de ORM (ex: Prisma).

---

## 🔒 Boas Práticas de Código e OOP

* **Comentários Obrigatórios**: Todos os métodos e classes devem ter documentação JSDoc clara, incluindo `@param` e `@returns` com tipos adequados.
* **Refatoração Proativa**: Métodos não devem passar de 25 linhas (`max-lines-per-function`).
* **Tratamento de Exceções**: 
  ```typescript
  try {
    // operação de risco
  } catch (error) {
    throw new AppError(500, 'Ocorreu um erro no processamento interno.');
  }
  ```
