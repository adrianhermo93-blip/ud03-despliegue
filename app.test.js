const test = require('node:test');
const assert = require('node:assert');
const { crearApp, textoVisitas } = require('./app');

test('textoVisitas usa singular y plural', () => {
  assert.strictEqual(textoVisitas(1), '1 visita');
  assert.strictEqual(textoVisitas(5), '5 visitas');
});

test('la portada responde 200 y suma la visita', async () => {
  let total = 0;
  const dbFalsa = {
    query: async (sql) => {
      if (sql.startsWith('INSERT')) total++;
      return { rows: [{ total }] };
    }
  };
  const servidor = crearApp(dbFalsa, 'pruebas').listen(0);
  const puerto = servidor.address().port;
  const res = await fetch(`http://127.0.0.1:${puerto}/`);
  const html = await res.text();
  servidor.close();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get('x-servidor'), 'pruebas');
  assert.match(html, /1 visita/);
});

test('/health devuelve ok', async () => {
  const servidor = crearApp({ query: async () => ({ rows: [] }) }, 'pruebas').listen(0);
  const puerto = servidor.address().port;
  const res = await fetch(`http://127.0.0.1:${puerto}/health`);
  const datos = await res.json();
  servidor.close();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(datos.estado, 'ok');
});
