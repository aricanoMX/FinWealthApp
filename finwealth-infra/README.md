# 🗄️ FinWealth Infra (Drizzle ORM)

Este repositorio contiene la definición del esquema de base de datos de FinWealth y las herramientas para gestionar migraciones y sincronización con PostgreSQL.

## 🏗️ Esquema y Tablas Core

1.  **Profiles:** Datos de identidad anclados a Supabase Auth.
2.  **Ledgers:** Libros contables (Personal, Negocio, etc.).
3.  **Accounts:** Cuentas financieras (Activos, Pasivos, etc.).
4.  **Transactions & Journal Entries:** Corazón de la contabilidad por partida doble.

## 🚀 Inicio Rápido (Paso a Paso)

### Paso 1: Configurar el Connection String (.env)
Crea un archivo `.env` en la raíz de la carpeta `finwealth-infra`.
**Importante:** El `SUPABASE_URL` no es la URL HTTP de la API, sino la cadena de conexión de **PostgreSQL (Transaction pooler)**. Debes incluir tu contraseña:
```env
# Ejemplo: postgresql://postgres.[tu-ref]:[tu-password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=tu_cadena_de_conexion_postgresql
```

### Paso 2: Instalación de Dependencias
Si no instalaste desde la raíz, instala las herramientas de Drizzle aquí:
```bash
npm install
```

### Paso 3: Sincronizar el Esquema con Supabase
Para construir las tablas y políticas en tu base de datos vacía, ejecuta:
```bash
npm run generate
npx drizzle-kit push
```

### Paso 4: Verificación
Abre tu panel de control de Supabase web, ve a la sección "Table Editor" y verifica que tablas como `profiles`, `ledgers` y `transactions` se hayan creado exitosamente.

## 🛠️ Configuración Local

1.  **Validar Tipos:** `npx tsc --noEmit`
