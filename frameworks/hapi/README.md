# @useoptic/hapi-middleware

<!-- Badges -->
![NPM](https://img.shields.io/npm/l/@useoptic/hapi-middleware)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/opticdev/optic-node/publish-hapi)

This module is an [hapi](https://hapi.dev/) middleware using [@useoptic/optic-node-sdk](https://www.npmjs.com/package/@useoptic/optic-node-sdk) to capture and format HTTP data to send to [Optic](https://www.useoptic.com). We have a [list of middleware available for some frameworks](https://github.com/opticdev/optic-node), if we are missing the framework [join our community](https://useoptic.com/docs/community/) and suggest the next framework or develop it with us.

## Requirements

The module requires `@useoptic/cli` to be installed, instructions on installing it are available [https://www.useoptic.com/docs/](https://www.useoptic.com/docs/).

## Intsall

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

Using a basic [hapi](https://hapi.dev/) server.

```js
const Hapi = require('@hapi/hapi')
const Optic = require('@useoptic/hapi-middleware')

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: 'localhost'
  })

  await server.register({
    plugin: Optic,
    options: {
      enabled: true
    }
  })
  server.route({
    method: ['GET', 'POST'],
    path: '/',
    handler: (request, h) => {
      return 'Hello World! ' + Math.random()
    }
  })

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  if (err) {
    console.log('ERROR')
    console.log(err)
    process.exit(1)
  }
})

init()

```

To start capturing data from the SDK, run your application with

```sh
api exec "node <your hapi server>"
```

## License
This software is licensed under the [MIT license](../LICENSE).