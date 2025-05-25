
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'alon',
  host: '192.168.100.46',
  database: 'rednova',
  password: 'equipo3606',
  port: 5432,
});

async function crearUsuario(email, plainPassword, area) {
  const password = await bcrypt.hash(plainPassword, 10);
  await pool.query(
    'INSERT INTO usuarios (email, password, area) VALUES ($1, $2, $3)',
    [email, password, area]
  );
  console.log(`Usuario ${email} creado en área ${area}`);
}

crearUsuario('ventas@rednova.com', '123456', 'ventas');
