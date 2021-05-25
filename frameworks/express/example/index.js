const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const optic = require('../').default;
const app = express()
const port = 3000

app.use(bodyParser())

app.use(optic({
    console: true,
    log: true,
    // local: true,
}))

app.use((oreq, ores) => {
  const options = {
    host: 'httpbin.org',
    path: oreq.path,
    method: oreq.method,
    headers: oreq.headers,
  };

  const creq = http
    .request(options, pres => {
      pres.setEncoding('utf8');
      ores.writeHead(pres.statusCode);
      pres.on('data', chunk => {
        ores.write(chunk);
      });
      pres.on('close', () => {
        ores.end();
      });
      pres.on('end', () => {
        ores.end();
      });
    })
    .on('error', e => {
      console.log(e.message);
      try {
        ores.writeHead(500);
        ores.write(e.message);
      } catch (e) {
      }
      ores.end();
    });

  creq.end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})