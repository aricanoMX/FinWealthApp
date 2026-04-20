# 🌌 FinWealth App (Elite Edition)

**FinWealth** es un Ecosistema Operativo Financiero Personal integral. Evoluciona desde un rastreador de gastos atómico (Contabilidad Estricta de Partida Doble) hacia un gestor fiscal para profesionales (Multi-Ledger), culminando como un Gestor Patrimonial impulsado por IA (Gestión de Portafolio y Análisis de Escenarios).

## 🏗️ Topología del Sistema (Monorepo Lógico)

Este repositorio sigue una estructura de monorepo lógico que contiene tres proyectos distintos (Patrón Polyrepo):

*   📱 **[`/finwealth-mobile`](./finwealth-mobile/README.md)**: Frontend en React Native (Expo). Estado global manejado vía Zustand. Animaciones fluidas a 60FPS vía Reanimated 3.
*   ⚙️ **[`/finwealth-backend`](./finwealth-backend/README.md)**: Backend en NestJS. Controladores REST para la ingesta de datos ("Tentáculos") y el Motor Financiero central.
*   🗄️ **[`/finwealth-infra`](./finwealth-infra/README.md)**: Repositorio central de infraestructura que contiene el esquema de base de datos en Drizzle ORM y las políticas RLS (Row-Level Security) de Supabase.

---

## 🚀 Inicio Rápido (Paso a Paso desde Cero)

Para que cualquier usuario pueda levantar la instancia del ecosistema FinWealth sin problemas, sigue exactamente estos pasos:

### Requisitos Previos Indispensables
* Instalar **Node.js** (v20 o superior).
* Crear una cuenta gratuita en [Supabase](https://supabase.com/).
* Descargar la aplicación **Expo Go** en tu celular (iOS o Android).

### Paso 1: Preparar la Base de Datos (Supabase)
1. Entra a Supabase y crea un nuevo proyecto.
2. Ve a `Project Settings` > `API` y guarda tu `Project URL` y tu `anon public key`.
3. Ve a `Project Settings` > `Database` y guarda tu **Connection string (URI)**. *Asegúrate de reemplazar el placeholder de la contraseña con tu contraseña real*.

### Paso 2: Clonar e Instalar
Clona el repositorio e instala las dependencias de todos los workspaces de golpe:
```bash
git clone <tu-repositorio>
cd FinWealthApp
npm install
```

### Paso 3: Inyección de Variables de Entorno (¡Crucial!)
Necesitas crear 3 archivos `.env` en los distintos proyectos. Puedes basarte en los `.env.example` si existen, o crearlos manualmente:
* **En `/finwealth-infra/.env`**: Añade `SUPABASE_URL` (El connection string de PostgreSQL).
* **En `/finwealth-backend/.env`**: Añade `SUPABASE_URL` (El mismo connection string) y `PORT=3000`.
* **En `/finwealth-mobile/.env`**: Añade `EXPO_PUBLIC_API_URL` (IP de tu máquina), `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

### Paso 4: Inicializar el Esquema de Base de Datos
Empuja las tablas y las políticas de seguridad a tu Supabase en blanco:
```bash
cd finwealth-infra
npx drizzle-kit push
cd ..
```

### Paso 5: Arranque Simultáneo
Vuelve a la raíz del proyecto y ejecuta:
```bash
npm run dev
```
*Este comando abrirá dos procesos en paralelo: el servidor backend en el puerto 3000 y el empaquetador de Expo con un código QR listo para escanear.*

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