# CreditSmart

CreditSmart es una aplicación FinTech desarrollada por FinTech Solutions S.A.S para gestionar productos crediticios y solicitudes de crédito con persistencia en la nube usando Firebase.

## 🚀 Características

- Gestión de productos crediticios desde Firestore
- CRUD completo de solicitudes de crédito
- Persistencia real en la nube (Firebase)
- Acceso multiusuario
- UI responsiva y accesible
- Mensajes de éxito y error integrados
- Separación clara entre entorno local (.env) y plantilla (.env.example)

## 🛠️ Tecnologías

- React + Vite
- Firebase (Firestore)
- CSS modular
- Git + GitHub

## 🔐 Variables de entorno

Este proyecto utiliza variables de entorno para conectar con Firebase.  
**Nunca subas tu archivo `.env` real.**  
En su lugar, usa el archivo `.env.example` como plantilla.

### 📄 `.env.example`

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
