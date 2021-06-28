# @useoptic/optic-node-sdk

<!-- Badges -->
![NPM](https://img.shields.io/npm/l/@useoptic/optic-node-sdk)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/opticdev/optic-node/publish-sdk)

The code library standardizing data capture for [Optic](https://www.useoptic.com) in Node applications. We have a [list of middleware available for some frameworks](https://github.com/opticdev/optic-node), if we are missing the framework [join our community](https://useoptic.com/docs/community/) and suggest the next framework or develop it with us.

## Requirements

The library requires `@useoptic/cli` to be installed, instructions on installing it are available [https://www.useoptic.com/docs/](https://www.useoptic.com/docs/).

## Intsall

```sh
npm install @useoptic/optic-node-sdk
```

## Usage

The library takes a configuration object and captures traffic in the background as long as `@useoptic/cli` is installed. 

### Configuration
All options are optional for easier configuration in your application
- `enabled`: `boolean` (defaults to `false`) Programmatically control if capturing data and sending it to Optic
- `uploadUrl`: `string` (defaults to `process.env.OPTIC_LOGGING_URL`) The URL to Optics capture URL, if left blank it will expect `OPTIC_LOGGING_URL` environment variable set by the Optic CLI
- `console`: `boolean` (defaults to `false`) Send to stdout/console for debugging
 - `framework`: `string` (defaults to '') Additional information to inform Optic of where it is capturing information

### Example
Using the default `http` server within Node

```js
const Optic = require('@useoptic/optic-node-sdk');
const http = require('http');

const optic = new Optic({
  enabled: true
});

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
```
To start capturing data from the SDK, run your application with
```sh
api exec "node <your example file>"
```

## License
This software is licensed under the [MIT license](../LICENSE).