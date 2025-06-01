const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const app = express();

const pool = new Pool({
  user: '', // Tu usuario de la base de datos
  host: '', // Tu host de la base de datos
  database: '', // Tu nombre de la base de datos
  password: '', // Tu contraseña de la base de datos
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '..', 'public')));



const ventasRoutes = require('./routes/ventas');
app.use('/api', ventasRoutes);

// Puedes hacer lo mismo para compras, finanzas, etc.


// Registro con área relacionada por id el cual se obtiene de la tabla areas
app.post('/register', async (req, res) => {
  const { name, email, password, area } = req.body;

  try {
    // Verificar usuario existe si ya está registrado de lo contrario no se puede registrar
    if (!name || !email || !password || !area) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    // Verificar si el usuario ya existe
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Correo electrónico inválido' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    const userExists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (userExists.rowCount > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Obtener id del área
    const areaResult = await pool.query('SELECT id FROM areas WHERE nombre = $1', [area]);
    if (areaResult.rowCount === 0) {
      return res.status(400).json({ error: 'Área inválida' });
    }
    const areaId = areaResult.rows[0].id;

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO usuarios (nombre, email, password, area_id) VALUES ($1, $2, $3, $4)',
      [name, email, hashedPassword, areaId]
    );

    res.json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error en /register:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Login con join para traer nombre de área
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(`
      SELECT u.password, a.nombre AS area
      FROM usuarios u
      JOIN areas a ON u.area_id = a.id
      WHERE u.email = $1
    `, [email]);

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
// Registrar una nueva reservación
app.post('/reservar', async (req, res) => {
  const { nombre, email, telefono, fecha_hora, motivo } = req.body;
  try {
    await pool.query(
      'INSERT INTO visitantes (nombre, email, telefono, motivo, entrada) VALUES ($1, $2, $3, $4, $5)',
      [nombre, email, telefono, motivo, fecha_hora]
    );
    res.json({ message: 'Reservación registrada exitosamente' });
  } catch (error) {
    console.error('Error al reservar:', error);
    res.status(500).json({ error: 'Error al registrar la reservación' });
  }
});

// Obtener visitantes activos (sin salida)
app.get('/visitantes/activos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM visitantes WHERE salida IS NULL ORDER BY entrada DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener visitantes:', error);
    res.status(500).json({ error: 'Error al obtener visitantes' });
  }
});

// Registrar salida de visitante
app.post('/visitantes/salida/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE visitantes SET salida = CURRENT_TIMESTAMP WHERE id = $1', [id]);
    res.json({ message: 'Salida registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar salida:', error);
    res.status(500).json({ error: 'Error al registrar salida' });
  }
});

// Ruta para enviar mensajes por correo
app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'TU_EMAIL@gmail.com',     // Pon aquí tu email
      pass: 'TU_CONTRASEÑA_APP',      // Pon aquí tu contraseña de app o token OAuth
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'DESTINATARIO@correo.com',     // Pon aquí a quién quieres enviar el correo
    subject: 'Mensaje desde formulario de contacto RedNova',
    text: `
Nombre: ${name}
Correo: ${email}
Mensaje:
${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mensaje enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
