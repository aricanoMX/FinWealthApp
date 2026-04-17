# 🌌 FinWealth App (Elite Edition) - La Biblia de Arquitectura y Flujo de Trabajo

Este documento es la **Verdad Única (Single Source of Truth)**. Define la arquitectura técnica, las bases de datos optimizadas y el flujo de trabajo colaborativo con Agentes e IA.

---

## 1. Stack Tecnológico Oficial
*   **Base de Datos:** PostgreSQL vía **Supabase** (Auth, RLS, Storage, MCP).
*   **Backend:** Node.js con **NestJS**.
    *   **ORM:** Drizzle ORM (Validación transaccional).
    *   **Infraestructura:** Google Cloud Run (Serverless).
*   **Frontend:** React Native con **Expo**. Estado: Zustand. Animaciones: Reanimated 3.

---

## 2. Bases de Datos Optimizadas (PostgreSQL)

Para garantizar velocidad analítica y consistencia financiera a gran escala:
*   **Índices Estratégicos:**
    *   `transactions`: Índice compuesto en `(ledger_id, date)` para acelerar radicalmente los reportes históricos y proyecciones de flujo de caja.
    *   `journal_entries`: Índices individuales en `account_id` (para cálculos de balance ultrarrápidos) y `transaction_id`.
*   **Aislamiento y Seguridad (RLS):** Toda tabla (`ledgers`, `accounts`, `transactions`) incluye políticas de *Row-Level Security* ancladas estrictamente al `user_id` del token JWT. Imposible fugar datos.
*   **Integridad de Partida Doble (El Balance Cero):** Se exige matemáticamente que la sumatoria de débitos y créditos en un `transaction_id` sea exactamente `0`.
    *   **Decisión Arquitectónica:** Esta validación se aplicará de forma estricta a nivel de **Aplicación (NestJS + Transacciones de Drizzle)** en lugar de usar Triggers en SQL. Esto nos asegura código más fácil de testear, escalabilidad en la lógica de negocio (ej. manejo multidivisa futuro) y mejor manejo de excepciones para el usuario. Antes de hacer `COMMIT` a la base de datos, el backend verificará el balance en memoria.

---

## 3. Flujo de Trabajo con Agentes e IA (El Estándar Elite)

Para interactuar en este proyecto, el Agente (IA) DEBE operar bajo las siguientes reglas estrictas:

### 3.1. Desarrollo Guiado por Pruebas (TDD Estricto)
Para cualquier módulo financiero crítico (ej. Inserción de Partida Doble, Motor de Normalización, Cálculos Fiscales):
1.  El Agente **primero escribirá pruebas unitarias exhaustivas** usando Jest/Vitest, las cuales fallarán inicialmente (Estado RED).
2.  Desarrollará el código mínimo y necesario para que las pruebas pasen (Estado GREEN).
3.  Refactorizará garantizando optimización y tipado estricto.

### 3.2. Integración de MCPs y Tipos (Single Source of Truth)
*   **Supabase MCP:** El Agente utilizará las herramientas/CLI de Supabase para descargar y sincronizar automáticamente los tipos de TypeScript desde el esquema de PostgreSQL (ej. `database.types.ts`). Queda **prohibido** declarar manualmente interfaces en TypeScript que representen tablas de la DB. Todo surge de la base de datos.
*   **Codebase Investigator:** Antes de proponer cambios estructurales (ej. modificar dependencias entre Tentáculos y el Motor Contable), el Agente utilizará obligatoriamente la herramienta `codebase_investigator` para auditar el impacto del cambio y prevenir la ruptura de servicios cruzados.

### 3.3. Criterio de "Terminado" (Definition of Done)
Ninguna tarea, épica o refactorización se da por completada ni se envía a revisión final sin antes haber ejecutado y superado localmente:
*   Verificación de tipado estricta: Ejecución limpia de `tsc --noEmit`.
*   Linter sin advertencias: Ejecución limpia de `npm run lint`.
*   Cobertura total: Los tests del módulo afectado pasan al 100%.

---

## 4. Control de Versiones y Operación Git (Monorepo Lógico)

*   **Commits Atómicos por Agente:** Cada acción, bugfix o feature delegada a un agente DEBE concluir con un commit propio, aislado y atómico. Queda estrictamente prohibido agrupar tareas no relacionadas en un mismo commit ("kitchen sink commits").
*   **Protocolo de Trazabilidad:** Al finalizar su tarea, el agente crea su commit con un mensaje descriptivo (bajo el estándar Conventional Commits) antes de devolver el control al Orquestador o pasar el flujo al siguiente sub-agente. Esto permite saber exactamente *qué agente hizo qué cambio*.
*   **Reversibilidad:** Esta granularidad estricta asegura que, ante una falla crítica, el Orquestador pueda ejecutar un `git revert` sobre una función específica del backend sin afectar el trabajo previo o posterior de la interfaz móvil.