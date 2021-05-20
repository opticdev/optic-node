const express = require('express')
const optic = require('../').default;
const app = express()
const port = 3000

app.use(optic({
    console: true,
    local: true,
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})