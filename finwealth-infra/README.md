# 🗄️ FinWealth Infra (Drizzle ORM)

Este repositorio contiene la definición del esquema de base de datos de FinWealth y las herramientas para gestionar migraciones y sincronización con PostgreSQL.

## 🏗️ Esquema y Tablas Core

1.  **Profiles:** Datos de identidad anclados a Supabase Auth.
2.  **Ledgers:** Libros contables (Personal, Negocio, etc.).
3.  **Accounts:** Cuentas financieras (Activos, Pasivos, etc.).
4.  **Transactions & Journal Entries:** Corazón de la contabilidad por partida doble.

## 🚀 Inicio Rápido (Paso a Paso)

### 1. Instalación de Dependencias
Instala las herramientas de Drizzle ejecutando el siguiente comando dentro de esta carpeta:
```bash
npm install
```

### 2. Configuración de Entorno (.env)
Crea un archivo `.env` dentro de esta carpeta con la URL de tu base de datos:
```env
SUPABASE_URL=tu_url_de_conexión_a_supabase
```

### 3. Ejecución
*   **Modo Individual (Drizzle):** Generar migraciones con `npx drizzle-kit generate`.
*   **Modo Simultáneo (App Completa):** Para correr el ecosistema completo (Backend + Mobile) desde la **raíz del proyecto**:
    ```bash
    npm run dev
    ```

## 🛠️ Configuración Local

1.  **Variables de Entorno:** Crea un `.env` con `SUPABASE_URL` para la conexión de base de datos.
2.  **Validar Tipos:** `npx tsc --noEmit`
