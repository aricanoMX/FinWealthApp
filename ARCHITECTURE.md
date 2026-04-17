# 🏛️ FinWealth App - Core Architecture & System Contracts (v1.0)

Este documento es la **Fuente de la Verdad Absoluta** para contratos de APIs, esquemas de base de datos, flujos de estado y el catálogo de Herramientas de Contexto (MCPs) que utiliza el Escuadrón Virtual.

---

## 1. Topología del Sistema (Polyrepo)
*   **`finwealth-mobile/`**: Frontend React Native (Expo). Estado global vía Zustand. Animaciones vía Reanimated 3.
*   **`finwealth-backend/`**: Backend NestJS. Controlador REST para ingesta de "Tentáculos". Drizzle ORM para consultas a base de datos.
*   **`finwealth-infra/`**: Repositorio central de Drizzle Schema y políticas RLS de Supabase.

---

## 2. Catálogo Oficial de MCPs (Model Context Protocols)
Para interactuar con el mundo exterior y garantizar la integridad del código, el Escuadrón Virtual (MAS) debe utilizar obligatoriamente los siguientes servidores MCP:

### 2.1 Supabase / PostgreSQL MCP (El Ojo de la Verdad)
*   **Uso Obligatorio:** Antes de escribir una query SQL o Drizzle, o al tipar la respuesta de un servicio en NestJS.
*   **Misión:** Extraer el DDL en vivo, analizar las Foreign Keys de Partida Doble (`journal_entries` -> `accounts`) y auditar las políticas de seguridad (RLS). Prohibido "alucinar" columnas.

### 2.2 NPM Helper MCP / Dependency MCP (El Guardián del Stack)
*   **Uso Obligatorio:** Para el agente `ops-deploy` y el Orquestador en flujos de mantenimiento.
*   **Misión:** Analizar el `package.json` de los 3 repositorios. Detectar vulnerabilidades (Security Audits), buscar las últimas versiones estables de las librerías (ej. React 19, Zustand) y realizar *upgrades* automatizados y seguros con validación TDD.

### 2.3 Jest / Testing MCP (El Inspector de Calidad)
*   **Uso Obligatorio:** Para el agente `qa-tester` en cada iteración del ciclo T-P-A-O.
*   **Misión:** Ejecutar suites de pruebas localmente. Si la cobertura del Motor Contable (`cpa-engine`) baja del 100%, o si se detectan *warnings* de tipado/eslint, el MCP rechaza automáticamente el commit.

### 2.4 Filesystem / Git MCP (Nativo)
*   **Uso Obligatorio:** Analista de Impacto (`code-auditor`).
*   **Misión:** Leer el contexto cruzado. Verificar que los hooks creados en `/finwealth-mobile` coincidan semánticamente con los endpoints de `/finwealth-backend`.

---

## 3. Contratos de Base de Datos (Drizzle ORM)
*(Nota: Extraído directamente de `finwealth-infra/src/schema.ts` vía Supabase MCP)*

### 3.1 Integridad de Partida Doble (Strict Double-Entry)
*   Toda interacción financiera reside en la tabla `transactions` y se disgrega atómicamente en múltiples `journal_entries`.
*   **Contrato Matemático (NestJS Level):** 
    `SUM(journal_entries.amount) WHERE transaction_id = X MUST EQUAL 0`
*   Los valores de `amount` en `journal_entries` son:
    *   **Positivos (+):** Incrementan el saldo de cuentas Activo/Gasto. Disminuyen Pasivo/Ingreso/Capital.
    *   **Negativos (-):** Incrementan el saldo de cuentas Pasivo/Ingreso/Capital. Disminuyen Activo/Gasto.

### 3.2 Aislamiento Multi-Ledger
*   Un usuario (`profiles`) puede poseer múltiples libros contables (`ledgers`).
*   Toda cuenta (`accounts`) y transacción (`transactions`) está ligada obligatoriamente a un `ledger_id`, nunca directamente al usuario. Esto permite separar la vida personal de las finanzas de un negocio.

---

## 4. Control de Versiones y Despliegue (Git Monorepo)

*   **Estructura Centralizada:** Un único repositorio `.git` en la raíz que engloba `/finwealth-mobile`, `/finwealth-backend` y `/finwealth-infra`.
*   **Regla de Commits Atómicos:** Cada tarea, mejora, corrección o módulo ejecutado por un agente del Escuadrón Virtual concluye obligatoriamente con un commit atómico aislado.
*   **Granularidad Estricta:** Un commit = Un propósito único (ej. `feat(backend): add POST /transactions`). Las features, fixes o refactors nunca se mezclan. El Orquestador exige este estándar a todos los sub-agentes.