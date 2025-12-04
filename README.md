CreditSmart 💳

Estudiante: Maria Lucia López Córdoba

CreditSmart es una aplicación web diseñada para simular, explorar y solicitar créditos de manera eficiente. El sistema permite a los usuarios comparar productos crediticios, calcular cuotas mensuales y enviar solicitudes directamente desde la interfaz, todo con una experiencia intuitiva y dinámica.

🚀 Descripción del Proyecto

CreditSmart ofrece tres módulos principales:

1. Catálogo de Créditos

Lista dinámica de productos desde creditsData.js (7 créditos definidos).

Componente reutilizable CreditCard.jsx.

Renderizado con .map() y paso de datos mediante props.

Plazos mostrados como rango mínimo–máximo (ejemplo: 12 - 60 meses).

2. Simulador

Búsqueda por nombre en tiempo real.

Filtro por rango de monto usando select.

Filtro por tasa de interés (ordenar de menor a mayor).

Mensaje “No hay créditos disponibles” si no hay resultados.

3. Solicitar Crédito

Formulario completo con useState para cada campo.

Validaciones en tiempo real (required en inputs).

Cálculo de cuota mensual estimada al cambiar monto o plazo.

Plazos dinámicos según el tipo de crédito elegido.

Resumen de la solicitud antes de enviar.

Almacenamiento de solicitudes en un array en memoria.

Mensaje de éxito y limpieza automática del formulario.

🛠️ Tecnologías Utilizadas

React

React Router DOM

Vite

CSS Modules

JavaScript (ES6+)

Intl para formateo de moneda

📦 Instalación

# Clonar el repositorio
git clone https://github.com/tu-usuario/creditsmart.git

# Acceder al proyecto
cd creditsmart

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

📁 Estructura del Proyecto

src/
├── components/
│   └── NavBar.jsx
│   └── CreditCard.jsx
├── pages/
│   └── Inicio.jsx
│   └── Simulador.jsx
│   └── Solicitar.jsx
├── data/
│   └── creditsData.js
├── App.jsx
├── main.jsx
├── styles.css
public/
├── img/
│   └── libreinversion.jpg
│   └── vehicular.jpg
│   └── vivienda.jpg
│   └── educativo.jpg
│   └── empresarial.jpg
│   └── hipotecario.jpg
│   └── compracartera.jpg
│   └── banner.jpg
│   └── vite.svg

📸 Capturas de Pantalla

Página de inicio con tarjetas de crédito dinámicas
<img width="1919" height="880" alt="image" src="https://github.com/user-attachments/assets/3db1309b-438e-4795-b825-8b67d2f61fc1" />

Código donde las tarjetas están renderizadas en inicio.jsx
<img width="965" height="208" alt="image" src="https://github.com/user-attachments/assets/e2dd102e-769f-47c8-a86d-155b915c7111" />

Simulador con filtros activos y búsqueda en tiempo real
<img width="1916" height="887" alt="image" src="https://github.com/user-attachments/assets/cbd49c43-9731-4f30-b7db-d2e98b5658bf" />
<img width="1919" height="886" alt="image" src="https://github.com/user-attachments/assets/aae5dcb5-4a4e-40df-aade-57beb62d0073" />
<img width="1918" height="879" alt="image" src="https://github.com/user-attachments/assets/2101551e-65a8-4ba9-aa10-f1a5c4448578" />
<img width="1918" height="879" alt="image" src="https://github.com/user-attachments/assets/a0f95adc-8295-48bd-b927-021381593a88" />

Formulario de solicitud con cálculo de cuota y resumen
<img width="957" height="877" alt="image" src="https://github.com/user-attachments/assets/3b3bb7fa-4d03-4411-aec4-8e70851639a6" />

# Licencia

Este proyecto es educativo y no representa una entidad financiera real. Puedes usarlo libremente para aprender, practicar o extenderlo.
---

## **Créditos**
Proyecto desarrollado para la asignatura *Ingeniería web 1*  
IU Digital de Antioquia, 2025



