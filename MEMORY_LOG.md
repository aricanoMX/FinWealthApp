# 🧠 FinWealth App - Memory Log & Decision Record

Este archivo funciona como el "Cerebro Externo" del Escuadrón Virtual. Aquí se registran las decisiones arquitectónicas clave, bugs conocidos y el estado actual del desarrollo para evitar repeticiones y alucinaciones en sesiones futuras.

---

## [ESTADO ACTUAL DEL SISTEMA]
*   **Fase:** Meta 1.1 - Setup de Infraestructura On-Demand.
*   **Repositorios Inicializados:** 
    *   `/finwealth-mobile` (Expo + React Native)
    *   `/finwealth-backend` (NestJS)
    *   `/finwealth-infra` (Drizzle + Schema Definido)
*   **Siguiente Acción Pendiente:** Conectar el ORM Drizzle con Supabase, definir los índices B-Tree en las tablas `transactions` y configurar TDD estricto en NestJS para la regla del "Balance Cero".

---

## [DECISIONES ARQUITECTÓNICAS (ADR)]

### ADR-001: Validación de Partida Doble en Aplicación (NestJS)
*   **Contexto:** Necesitábamos forzar la regla inquebrantable de `Débitos + Créditos = 0`.
*   **Decisión:** Se implementará a nivel de la lógica de negocio en **NestJS** (Validación Transaccional), y NO mediante Triggers en PostgreSQL.
*   **Justificación:** Facilita el TDD estricto, permite escalar la lógica hacia operaciones multidivisa en el futuro, y hace más claro el manejo de excepciones de error para la UI móvil.

### ADR-002: Aislamiento Fiscal (Multi-Ledger) desde el Día 1
*   **Contexto:** Los usuarios profesionales necesitan separar finanzas personales de su negocio (Impuestos, IVA, Deducciones).
*   **Decisión:** En lugar de agregar una entidad `business` a posteriori, se inyecta la tabla `ledgers` (Libros) como el centro del esquema. Todas las cuentas y transacciones pertenecen a un Libro.
*   **Justificación:** Evita refactorizaciones catastróficas del motor de cálculo de Net Worth.

### ADR-003: Actualizaciones de Stack vía NPM MCP
*   **Contexto:** Mantener seguro el código (NestJS, React 19, Reanimated).
*   **Decisión:** El agente `ops-deploy` utilizará periódicamente el *NPM Helper MCP* para auditar dependencias. Todo upgrade deberá estar respaldado por la ejecución y éxito de las suites de prueba generadas por el `qa-tester`.

---

## [BUGS CONOCIDOS Y EXCEPCIONES]
*(Este bloque será llenado por el `code-auditor` y el `qa-tester` durante la ejecución de los ciclos de desarrollo).*
*   *Ninguno reportado actualmente.*