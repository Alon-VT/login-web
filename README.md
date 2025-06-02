# RedNova - Sitio Web Corporativo

Este proyecto es el sitio web oficial de **RedNova**, una empresa especializada en el desarrollo de redes. El objetivo principal es proporcionar una plataforma clara, profesional y funcional para la interacción con clientes, incluyendo una sección de recepción donde se pueden realizar reservaciones directamente.

---

## ✨ Características principales

- Página de inicio con información corporativa.
- Formulario de recepción funcional para realizar reservaciones.
- Conexión a base de datos PostgreSQL.
- Diseño moderno con buena accesibilidad y contraste visual.
- Despliegue en servidor privado que ejecuta la base de datos de forma local.
- Optimizado para uso con shell Zsh y terminal kitty.

---

## 🛠️ Tecnologías utilizadas

| Componente   | Tecnología               |
|--------------|-------------------------|
| Frontend     | HTML5, CSS3, JavaScript |
| Backend      | Node.js, Express        |
| Base de datos| PostgreSQL              |
| Servidor     | Debian Bookworm         |
| Shell        | Zsh                     |
| Terminal     | kitty y Alacritty       |

---

## 📦 Instalación local

### Requisitos previos

- PostgreSQL instalado y funcionando.
- Node.js v18 o superior.
- Git instalado.

### Pasos para instalación y ejecución


1. Clona el repositorio:

```bash
git clone https://github.com/Alon-VT/rednova-website.git
cd rednova-website
```

2. Instala dependencias:

```bash
npm install
```

3. Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE rednova;
```

4. Crea un archivo `.env` en la raíz con las siguientes variables:

```
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/rednova
PORT=3000
```

5. Ejecuta el servidor:

```bash
npm run dev
```

6. Abre en el navegador: `http://localhost:3000`

## 📂 Estructura del proyecto

```
rednova-website/
│
├── js/
│   └── index.js          # Backend: conexión a la base de datos y rutas
│
├── public/               # Archivos estáticos (frontend)
│   ├── AREAS/            # Contenido HTML estático de áreas específicas
│   ├── CSS/              # Archivos CSS para estilos
│   ├── JS/               # Scripts JavaScript del frontend
│   ├── IMG/              # Imágenes usadas en el sitio
│   ├── index.html        # Página principal
│   ├── login.html        # Página de login (futura funcionalidad)
│   └── registro.html     # Página de registro (futura funcionalidad)
│
├── node_modules/         # Módulos de Node.js instalados
├── .env                
├── package.json          # Configuración del proyecto y dependencias
└── README.md             # Documentación del proyecto (este archivo)

```

## ✅ Funcionalidades futuras

- Sistema de login para empleados.
- Panel de control administrativo.
- Notificaciones por correo al reservar.
- corecion de errores 

## 📖 Licencia

Este proyecto está bajo la licencia MIT. Libre de uso con fines educativos o comerciales.
