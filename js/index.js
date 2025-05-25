const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();

// Conexión a PostgreSQL
const pool = new Pool({
  user: 'alon',
  host: '192.168.100.46',
  database: 'rednova_db',
  password: 'equipo3606',
  port: 5432,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta: Registro
app.post('/register', async (req, res) => {
  const { name, email, password, area } = req.body;

  try {
    // Validar si el usuario ya existe
    const userExists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (userExists.rowCount > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO usuarios (nombre, email, password, area) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, area]
    );

    res.json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error en /register:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Ruta: Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT password, area FROM usuarios WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const { password: hashedPassword, area } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
      return res.json({ message: 'Login exitoso', area });
    } else {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
