const express = require('express');

function textoVisitas(n) {
  return n === 1 ? '1 visita' : `${n} visitas`;
}

function crearApp(db, host) {
  const app = express();

  app.use((req, res, next) => {
    res.set('X-Servidor', host);
    next();
  });

  app.get('/', async (req, res) => {
    try {
      await db.query('INSERT INTO visitas DEFAULT VALUES');
      const r = await db.query('SELECT COUNT(*)::int AS total FROM visitas');
      res.send(`<h1>UD03 - Despliegue con contenedores</h1>
<p>Servidor: ${host}</p>
<p>${textoVisitas(r.rows[0].total)}</p>`);
    } catch (e) {
      res.status(500).send('Error al conectar con la base de datos');
    }
  });

  app.get('/health', (req, res) => {
    res.json({ estado: 'ok' });
  });

  return app;
}

module.exports = { crearApp, textoVisitas };
