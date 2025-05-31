const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();


const pool = new Pool({
  user: '', // Cambia esto por tu usuario de PostgreSQL
  host: '', // Cambia esto por tu host de PostgreSQL
  // Por ejemplo, 'localhost' o la IP de tu servidor
  // Si estás usando un servicio en la nube, coloca aquí la URL del host
  database: 'rednova', 
  password: '',  // Cambia esto por tu contraseña de PostgreSQL
  
  port: 5432,
  ssl: {
    rejectUnauthorized: false  
  }
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, '..', 'public')));


app.post('/register', async (req, res) => {
  const { name, email, password, area } = req.body;

  try {

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

const nodemailer = require('nodemailer');

app.post('/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',           
      pass: '',      
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: '',              
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
