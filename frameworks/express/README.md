# @useoptic/express-middleware

<!-- Badges -->
![NPM](https://img.shields.io/npm/l/@useoptic/express-middleware)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/opticdev/optic-node/publish-express)

This module is an [Express](https://expressjs.com/) middleware using [@useoptic/optic-node-sdk](https://www.npmjs.com/package/@useoptic/optic-node-sdk) to capture and format HTTP data to send to [Optic](https://www.useoptic.com). We have a [list of middleware available for some frameworks](https://github.com/opticdev/optic-node), if we are missing the framework [join our community](https://useoptic.com/docs/community/) and suggest the next framework or develop it with us.

## Requirements

The module requires `@useoptic/cli` to be installed, instructions on installing it are available [https://www.useoptic.com/docs/](https://www.useoptic.com/docs/).

It also requires something like [`body-parser`](https://www.npmjs.com/package/body-parser) to be used as part of the middleware stack to access the body of the HTTP requests within Express

## Install

```sh
npm install @useoptic/express-middleware
```

## Usage

The middleware takes a configuration object and captures traffic in the background as long as `@useoptic/cli` is installed. 

### Configuration

All options are optional for easier configuration in your application
- `enabled`: `boolean` (defaults to `false`) Programmatically control if capturing data and sending it to Optic
- `uploadUrl`: `string` (defaults to `process.env.OPTIC_LOGGING_URL`) The URL to Optics capture URL, if left blank it will expect `OPTIC_LOGGING_URL` environment variable set by the Optic CLI
- `console`: `boolean` (defaults to `false`) Send to stdout/console for debugging
- `framework`: `string` (defaults to '') Additional information to inform Optic of where it is capturing information

### Example

Using a basic [Express](https://expressjs.com/) server proxying to [httpbin](https://httpbin.org) for easy endpoints

```js
const express = require('express')
const bodyParser = require('body-parser')
const { createProxyMiddleware } = require('http-proxy-middleware');
const { OpticMiddleware } = require('@useoptic/express-middleware');

const app = express()
const port = 3000

app.use(bodyParser())
app.use(OpticMiddleware({
    enabled: true,
}))

app.use('/', createProxyMiddleware({ target: 'https://httpbin.org', changeOrigin: true }));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

To start capturing data from the SDK, run your application with

```sh
api exec "node <your express server>"
```

## License
This software is licensed under the [MIT license](../LICENSE).