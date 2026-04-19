# ⚙️ FinWealth Backend (NestJS)

Este es el núcleo lógico del ecosistema FinWealth, construido sobre **NestJS**. Maneja la lógica de negocio, validaciones financieras de partida doble y la persistencia de datos a través de Drizzle ORM.

## 🚀 Inicio Rápido (Paso a Paso)

### 1. Instalación de Dependencias
Ejecuta el siguiente comando dentro de esta carpeta para instalar las librerías necesarias:
```bash
npm install
```

### 2. Configuración de Entorno (.env)
Crea un archivo `.env` en este directorio con las siguientes variables esenciales:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_anonima_de_supabase
PORT=3000
```

### 3. Ejecución
*   **Modo Individual:** Para correr solo el backend: `npm run start:dev`
*   **Modo Simultáneo (Recomendado):** Para correr todo el ecosistema (Backend + Mobile) al mismo tiempo, ve a la **raíz del proyecto** y ejecuta:
    ```bash
    npm run dev
    ```

## 🛠️ Estándares y TDD

Este backend aplica **TDD estricto**. Toda lógica financiera debe estar respaldada por tests antes de ser implementada.

* **Ejecutar tests:** `npm test`
* **Verificar tipado:** `npx tsc --noEmit`
* **Linter:** `npm run lint`

## 🏗️ Arquitectura (DDD Simplificado)

* `src/core`: Filtros globales, configuración y base de datos.
* `src/cpa-engine`: El motor contable puro (validación matemática).
* `src/transactions`: Módulo de transacciones con separación de Controlador, Servicio y Repositorio.
