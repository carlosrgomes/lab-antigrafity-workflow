---
name: nodejs-frontend
description: "Guidelines for high-end frontend engineering, responsive design, animations, component isolation, and UI accessibility."
---

# Habilidade: Engenharia de Frontend

Esta skill define as regras de desenvolvimento estético e de componentização do frontend.

---

## 🎨 Princípios Estéticos Premium

1. **Uso de Cores e Gradientes**:
   * Defina uma paleta CSS no root:
     ```css
     :root {
       --primary-gradient: linear-gradient(135deg, #ff007f 0%, #7f00ff 100%);
       --dark-bg: #0d0e12;
       --glass-effect: rgba(255, 255, 255, 0.05);
       --border-glass: rgba(255, 255, 255, 0.1);
     }
     ```
   * Evite cores sólidas planas, dando preferência a fundos profundos e elementos translúcidos de vidro (glassmorphism: `backdrop-filter: blur(10px)`).

2. **Micro-interações**:
   * Adicione transições suaves em todos os estados de hover:
     ```css
     .card {
       transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
     }
     .card:hover {
       transform: translateY(-5px);
       box-shadow: 0 10px 20px rgba(127, 0, 255, 0.2);
     }
     ```

---

## 🏗️ Estrutura de Componentes

* **React + Vite**: Organize componentes na pasta `src/components/[ComponentName]`.
* **Estilização Isolada**: Cada componente deve vir acompanhado de seu respectivo arquivo CSS (ex: `Button.tsx` e `Button.css`).
* **Segurança de Tipos**: Use TypeScript para definir todas as propriedades (`Props`) dos componentes.
