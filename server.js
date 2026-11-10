const os = require('os');
const { Pool } = require('pg');
const { crearApp } = require('./app');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'app',
  password: process.env.DB_PASSWORD || 'app',
  database: process.env.DB_NAME || 'app'
});

const PORT = process.env.PORT || 3000;
const app = crearApp(pool, os.hostname());

async function iniciar() {
  for (let i = 0; i < 10; i++) {
    try {
      await pool.query('CREATE TABLE IF NOT EXISTS visitas (id SERIAL PRIMARY KEY, fecha TIMESTAMP DEFAULT NOW())');
      console.log('Conectado a la base de datos');
      break;
    } catch (e) {
      console.log('Esperando a la base de datos...');
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  app.listen(PORT, () => console.log(`Aplicación escuchando en el puerto ${PORT}`));
}

iniciar();
