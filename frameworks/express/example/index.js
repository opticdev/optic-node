const express = require('express')
const bodyParser = require('body-parser')
const { createProxyMiddleware } = require('http-proxy-middleware')
const optic = require('../').default
const app = express()
const port = 3000

app.use(bodyParser())

app.use(optic({
  console: true,
  enabled: true
}))

app.use('/', createProxyMiddleware({ target: 'https://httpbin.org', changeOrigin: true }))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
