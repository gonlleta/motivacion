# ✨ Impulso — App & APK de Motivación Personalizada

Aplicación móvil (React + Tailwind + Capacitor + PWA) que personaliza **frases motivadoras, fotografías de alta resolución y notificaciones programadas** mediante un **cuestionario interactivo**.

## 🚀 Características Principales
- **Cuestionario de Onboarding (5 pasos)**: Evalúa estado de ánimo, obstáculo principal, pilares de crecimiento (Metas, Disciplina, Paz/Anti-Estrés, Amor Propio, Fitness, Emprendimiento), estilo visual de fotos y horarios diarios.
- **Notificaciones Reales y Simulador Interactivo**:
  - Usa `@capacitor/local-notifications` en Android nativo para programar alertas recurrentes (Mañana, Tarde y Noche).
  - Incluye notificaciones Web/Service Worker y un **Banner estilo Android** con foto y frase que puedes probar al instante con el botón **¡Motívame!**.
- **Generador de Pósters HD (1080x1350)**: Descarga cualquier tarjeta con su fotografía, frase y autor lista para historias de Instagram o estados de WhatsApp.
- **Compartir directo en WhatsApp y Favoritos**: Guarda tus frases preferidas o crea tus propias tarjetas motivadoras.

## 💻 Ejecutar y Probar ahora mismo
```bash
npm install
npm run dev
```

## 📱 Cómo obtener/instalar la App en tu Android (3 Opciones)

### Opción 1: Instalar directo desde el navegador (PWA sin cables)
1. Abre el enlace local en tu celular o navegador Chrome.
2. Toca **"Instalar en tu pantalla de inicio"** (o desde el menú de Chrome: *Instalar aplicación*).

### Opción 2: Compilar el `.apk` localmente con Android Studio
La carpeta nativa `android/` ya está generada y sincronizada con Capacitor:
```bash
npm run cap:sync
npm run cap:open
```
En Android Studio ve a **Build > Build Bundle(s) / APK(s) > Build APK(s)** y obtendrás el archivo `app-debug.apk`.

### Opción 3: Compilar el `.apk` en la nube sin instalar Android Studio
El proyecto incluye [`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml). Al subir este proyecto a un repositorio de GitHub, la pestaña **Actions** compilará automáticamente el archivo `Impulso-Motivacion-APK.apk` listo para descargar.

