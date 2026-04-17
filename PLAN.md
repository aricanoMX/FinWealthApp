# FinWealth App - Roadmap & Estructura de Ejecución

## 1. Visión Global
Evolución desde Cashflow atómico -> Gestión Fiscal Multi-Ledger -> Wealth Manager impulsado por IA.

## 2. Metodología: Objetivos > Metas > Épicas

### 🎯 OBJETIVO 1: El "CFO de Bolsillo" (Fundamentos y Cashflow)
**Meta 1.1: Núcleo Contable y BD Optimizada (Semanas 1-4)**
*   **Épica 1:** Setup de Infraestructura On-Demand (Supabase + Cloud Run + NestJS).
*   **Épica 2:** Motor de Partida Doble (DB Schema: Creación de tablas, Índices B-Tree compuestos para reportes rápidos, Políticas RLS ancladas al User ID).
*   **Épica 3:** Capa de Validación Transaccional NestJS (Implementación de **TDD Estricto** para garantizar y testear que el balance matemático de cada transacción sea siempre = 0).
*   **Épica 4:** UI Mobile MVP (Expo + Zustand) - Dashboard y Onboarding interactivo.

**Meta 1.2: Automatización de Ingesta (Semanas 5-8)**
*   **Épica 1:** Tentáculo Android (Notificaciones Push & SMS Listener).
*   **Épica 2:** Tentáculo Email (Workers para Gmail/Outlook).
*   **Épica 3:** Tentáculo iOS (Webhook para Apple Shortcuts).
*   **Épica 4:** Motor de Normalización y Conciliación de Transferencias.

### 🎯 OBJETIVO 2: Inteligencia Fiscal y Negocios (Multi-Ledger)
**Meta 2.1: Separación de Entornos (Semanas 9-11)**
*   **Épica 1:** Arquitectura Multi-Ledger (Soporte nativo de Múltiples Libros).
*   **Épica 2:** Motor de Impuestos (Flags de Deducibilidad, Cuentas puente para IVA).
*   **Épica 3:** Almacenamiento de Comprobantes XML/PDF (Supabase Storage).

**Meta 2.2: Predicción de Liquidez (Semanas 12-14)**
*   **Épica 1:** UI de Ciclos de Cuenta y Límites.
*   **Épica 2:** Algoritmo Predictivo de Flujo de Caja (30/60 días).
*   **Épica 3:** Sistema de Alertas Tempranas (Push).

### 🎯 OBJETIVO 3: Wealth Management & IA (Gestor Patrimonial)
**Meta 3.1: Portafolio de Inversiones (Semanas 15-18)**
*   **Épica 1:** Catálogo de Activos Atómicos y Tenencias Puras.
*   **Épica 2:** Integración de APIs de Mercado (Mark-to-Market en tiempo real).
*   **Épica 3:** UI del Portafolio Visual y Dinámico.

**Meta 3.2: El Consejero IA (Semanas 19-22)**
*   **Épica 1:** Integración de Modelo LLM (ej. Gemini) al backend.
*   **Épica 2:** Prompt Engineering Financiero Privado (Datos Anónimos).
*   **Épica 3:** Sugerencias Activas de Liquidez Ociosa.
*   **Épica 4:** Simulador de Pruebas de Estrés Patrimonial.

---

## 3. Protocolos de Desarrollo de Agentes
Todas las épicas del presente roadmap deben desarrollarse rigurosamente bajo: **TDD Estricto**, generación de interfaces con **Supabase MCP** desde PostgreSQL, y auditorías de código usando **codebase_investigator** antes de cualquier alteración arquitectónica o de refactor.