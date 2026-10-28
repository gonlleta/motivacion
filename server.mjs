import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.css': 'text/css; charset=utf-8',
  '.apk': 'application/vnd.android.package-archive'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  if (urlPath === '/api/quote') {
    const quotes = [
      { quote: 'No midas tu progreso con la regla de otra persona. Compite únicamente con quien eras ayer.', author: 'Sabiduría Estoica', category: 'Metas y Éxito' },
      { quote: 'La motivación te pone en marcha, pero es la disciplina la que te hace imparable cuando nadie te ve.', author: 'Jim Ryun', category: 'Disciplina' },
      { quote: 'Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás la fuerza.', author: 'Marco Aurelio', category: 'Paz Interior' },
      { quote: 'Has sobrevivido al 100% de tus días más difíciles. Tienes dentro de ti una resiliencia extraordinaria.', author: 'Impulso Diario', category: 'Amor Propio' },
      { quote: 'Somos lo que hacemos repetidamente. La excelencia no es un acto, sino un hábito.', author: 'Aristóteles', category: 'Hábitos' }
    ];
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(random));
    return;
  }

  let filePath;

  if (urlPath === '/' || urlPath === '/index.html') {
    filePath = path.join(__dirname, 'app-standalone.html');
  } else {
    filePath = path.join(__dirname, 'public', urlPath);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, urlPath);
    }
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Impulso Motivacion corriendo en http://localhost:${PORT}`);
});

