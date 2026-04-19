# 🌌 FinWealth App (Elite Edition)

**FinWealth** es un Ecosistema Operativo Financiero Personal integral. Evoluciona desde un rastreador de gastos atómico (Contabilidad Estricta de Partida Doble) hacia un gestor fiscal para profesionales (Multi-Ledger), culminando como un Gestor Patrimonial impulsado por IA (Gestión de Portafolio y Análisis de Escenarios).

## 🏗️ Topología del Sistema (Monorepo Lógico)

Este repositorio sigue una estructura de monorepo lógico que contiene tres proyectos distintos (Patrón Polyrepo):

*   📱 **[`/finwealth-mobile`](./finwealth-mobile/README.md)**: Frontend en React Native (Expo). Estado global manejado vía Zustand. Animaciones fluidas a 60FPS vía Reanimated 3.
*   ⚙️ **[`/finwealth-backend`](./finwealth-backend/README.md)**: Backend en NestJS. Controladores REST para la ingesta de datos ("Tentáculos") y el Motor Financiero central.
*   🗄️ **[`/finwealth-infra`](./finwealth-infra/README.md)**: Repositorio central de infraestructura que contiene el esquema de base de datos en Drizzle ORM y las políticas RLS (Row-Level Security) de Supabase.

---

## 🚀 Inicio Rápido (Ejecución Simultánea)

Para iniciar todos los servicios del ecosistema localmente con un solo comando:

1.  **Instalar dependencias en la raíz:** `npm install`
2.  **Configurar Variables de Env:** Asegúrate de tener los archivos `.env` configurados en `/finwealth-backend` y `/finwealth-mobile` según sus respectivos READMEs.
3.  **Ejecutar todo en paralelo:**
    ```bash
    npm run dev
    ```
    *Este comando iniciará el backend en el puerto 3000 y el servidor de Expo de manera simultánea.*

---

## 📚 Documentación Core (La "Biblia")

El desarrollo de FinWealth está gobernado estrictamente por un conjunto de documentos arquitectónicos base. **Estos son la Única Fuente de la Verdad (Single Source of Truth)** para cualquier desarrollador o Agente de IA que trabaje en el proyecto:

1.  **[GEMINI.md](./GEMINI.md)**: La Biblia Arquitectónica. Contiene el stack tecnológico oficial, reglas estrictas de Partida Doble y protocolos de flujo de trabajo TDD.
2.  **[PLAN.md](./PLAN.md)**: El roadmap estratégico desglosado en Objetivos, Metas y Épicas.
3.  **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Contratos del sistema, reglas de aislamiento Multi-Ledger y el catálogo oficial de Model Context Protocols (MCPs) utilizados por el Escuadrón Virtual.
4.  **[AGENT_TEAM.md](./AGENT_TEAM.md)**: Definición del Sistema Multi-Agente (MAS v2.0) / Escuadrón Virtual, detallando los roles, límites y responsabilidades de cada sub-agente de IA especializado.
5.  **[MEMORY_LOG.md](./MEMORY_LOG.md)**: El "Cerebro Externo" del proyecto, donde se registran los Architectural Decision Records (ADRs) y bugs conocidos.

## 🚀 Flujo de Trabajo y Estándares de Desarrollo

Este proyecto impone un estándar de **Calidad de Tolerancia Cero (Zero-Tolerance Quality)** utilizando un enfoque de Desarrollo Guiado por Pruebas (TDD estricto) para toda la lógica financiera core.

*   **Commits Atómicos y Aislados:** Cada funcionalidad, corrección de errores o módulo DEBE aislarse en su propio commit siguiendo el estándar de *Conventional Commits* (ej. `feat(backend): add POST /transactions`). Los commits que agrupan tareas no relacionadas ("kitchen sink commits") están estrictamente prohibidos.
*   **Desarrollo Asistido por Agentes (Agentic SDLC):** El desarrollo es orquestado utilizando un Escuadrón Virtual de agentes de IA. Antes de cualquier cambio estructural, se debe auditar el impacto cruzado en los servicios.

---
*Construido con precisión matemática y principios contables estrictos.*