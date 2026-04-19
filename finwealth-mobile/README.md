# 📱 FinWealth Mobile (Expo / React Native)

Interfaz de usuario para el ecosistema FinWealth, construida con **Expo** y **React Native**. Enfocada en ofrecer una experiencia fluida, rápida y segura.

## 🚀 Inicio Rápido (Paso a Paso)

### 1. Instalación de Dependencias
Instala todas las librerías necesarias con el siguiente comando dentro de esta carpeta:
```bash
npm install
```

### 2. Configurar el Backend (.env)
Asegúrate de tener el backend corriendo o define tu URL en un archivo `.env` dentro de esta carpeta:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 3. Ejecución
*   **Modo Individual:** Para iniciar solo Expo Go: `npm run start`
*   **Modo Simultáneo (Recomendado):** Para correr todo el ecosistema (Backend + Mobile) al mismo tiempo, ve a la **raíz del proyecto** y ejecuta:
    ```bash
    npm run dev
    ```

## 🛠️ Estándares y TDD

La UI de FinWealth se desarrolla con **TDD (React Native Testing Library)** para componentes críticos y lógicas de estado global.

* **Ejecutar tests:** `npm test`
* **Verificar tipado:** `npx tsc --noEmit`

## 🏗️ Estado y Autenticación

* **Zustand:** Manejo de estado global en `src/store`.
* **Capa de Red:** Cliente Axios con interceptores para errores en `src/api/client.ts`.
* **Sesión Segura:** `expo-secure-store` para almacenar JWTs de Supabase.
