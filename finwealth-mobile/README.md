# 📱 FinWealth Mobile (Expo / React Native)

Interfaz de usuario para el ecosistema FinWealth, construida con **Expo** y **React Native**. Enfocada en ofrecer una experiencia fluida, rápida y segura.

## 🚀 Inicio Rápido (Paso a Paso)

### Paso 1: El Secreto de las Variables de Entorno (⚠️ CRÍTICO)
Crea un archivo `.env` en la raíz de `finwealth-mobile`. 
**Advertencia:** Si vas a probar la app en tu celular físico, `localhost` NO funcionará porque tu celular buscará en sí mismo, no en tu PC. Debes usar la **dirección IP de tu computadora** en tu red local (ej. 192.168.1.XX).

```env
# Reemplaza con la IP de tu computadora en tu red WiFi
EXPO_PUBLIC_API_URL=http://192.168.1.75:3000
# Credenciales de tu proyecto de Supabase (Project Settings > API)
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_api_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### Paso 2: Instalación de Dependencias
Si no lo hiciste en la raíz, instala las librerías aquí:
```bash
npm install
```

### Paso 3: Arrancar Expo
Inicia el servidor empaquetador de Metro/Expo:
```bash
npx expo start
```

### Paso 4: Abrir la App en tu Dispositivo
Una vez que veas el código QR en la terminal:
*   **iOS:** Abre la cámara nativa de tu iPhone, apunta al QR y toca el enlace emergente de Expo Go.
*   **Android:** Abre la aplicación **Expo Go**, selecciona "Scan QR Code" y apunta a tu pantalla.

## 🛠️ Estándares y TDD

La UI de FinWealth se desarrolla con **TDD (React Native Testing Library)** para componentes críticos y lógicas de estado global.

* **Ejecutar tests:** `npm test`
* **Verificar tipado:** `npx tsc --noEmit`

## 🏗️ Estado y Autenticación

* **Zustand:** Manejo de estado global en `src/store`.
* **Capa de Red:** Cliente Axios con interceptores para errores en `src/api/client.ts`.
* **Sesión Segura:** `expo-secure-store` para almacenar JWTs de Supabase.
