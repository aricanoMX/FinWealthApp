# 🗄️ FinWealth Infra (Drizzle ORM)

Este repositorio contiene la definición del esquema de base de datos de FinWealth y las herramientas para gestionar migraciones y sincronización con PostgreSQL.

## 🏗️ Esquema y Tablas Core

1.  **Profiles:** Datos de identidad anclados a Supabase Auth.
2.  **Ledgers:** Libros contables (Personal, Negocio, etc.).
3.  **Accounts:** Cuentas financieras (Activos, Pasivos, etc.).
4.  **Transactions & Journal Entries:** Corazón de la contabilidad por partida doble.

## 🚀 Uso de Drizzle Kit

*   **Generar Migración:** `npx drizzle-kit generate`
*   **Sincronizar (Push):** `npx drizzle-kit push` (Usa con precaución en producción).

## 🛠️ Configuración Local

1.  **Variables de Entorno:** Crea un `.env` con `SUPABASE_URL` para la conexión de base de datos.
2.  **Validar Tipos:** `npx tsc --noEmit`
