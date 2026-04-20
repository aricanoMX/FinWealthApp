# ⚙️ FinWealth Backend (NestJS)

Este es el núcleo lógico del ecosistema FinWealth, construido sobre **NestJS**. Maneja la lógica de negocio, validaciones financieras de partida doble y la persistencia de datos a través de Drizzle ORM.

## 🚀 Inicio Rápido (Paso a Paso)

### Paso 1: Configuración de Entorno (.env)
Crea un archivo `.env` en la raíz de `finwealth-backend` con las siguientes variables esenciales:
```env
# Cadena de conexión PostgreSQL (misma que en infra)
SUPABASE_URL=tu_cadena_de_conexion_postgresql
# URL de API y clave anónima (si se requieren para validación JWT)
SUPABASE_API_URL=tu_url_de_api_supabase
SUPABASE_KEY=tu_clave_anonima_de_supabase
PORT=3000
```

### Paso 2: Instalación de Dependencias
Si no las instalaste desde la raíz, hazlo aquí:
```bash
npm install
```

### Paso 3: Arrancar el Servidor
Para correr solo el backend de forma local:
```bash
npm run start:dev
```

### Paso 4: Verificación de Salud
Abre tu navegador web e ingresa a `http://localhost:3000`. Deberías recibir una respuesta (ej. "Hello World" o similar) indicando que NestJS inicializó el `CpaEngineModule` y está escuchando correctamente.

## 🛠️ Estándares y TDD

Este backend aplica **TDD estricto**. Toda lógica financiera debe estar respaldada por tests antes de ser implementada.

* **Ejecutar tests:** `npm test`
* **Verificar tipado:** `npx tsc --noEmit`
* **Linter:** `npm run lint`

## 🏗️ Arquitectura (DDD Simplificado)

* `src/core`: Filtros globales, configuración y base de datos.
* `src/cpa-engine`: El motor contable puro (validación matemática).
* `src/transactions`: Módulo de transacciones con separación de Controlador, Servicio y Repositorio.
