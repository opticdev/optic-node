const Optic = require('../').default;
const http = require('http');

const optic = new Optic({
  enabled: true,
  console: true,
  local: true,
})
const server = http.createServer((req, res) => {
  optic.captureHttpRequest(req, res);
  res.writeHead(200);
  res.end();
});
const port = 3000;
const host = 'localhost';
server.listen(port, host, () => {
  console.log(`Listen http://${host}:${port}`);
});