const Hapi = require('@hapi/hapi')
const Optic = require('../').default

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: 'localhost'
  })

  await server.register({
    plugin: Optic,
    options: {
      enabled: true,
      console: true
    }
  })
  server.route({
    method: ['GET', 'POST'],
    path: '/',
    handler: (request, h) => {
      return 'Hello World!' + Math.random()
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
