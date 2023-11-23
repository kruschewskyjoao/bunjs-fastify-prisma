import Fastify from 'fastify';
import schemaPlugin from './schema-errors';

const server = Fastify({
  logger: true,
});

//error global level
server.setErrorHandler((err, req, rep) => {
 rep.status(500).send("Error from root");
})

server.register(schemaPlugin);

server.listen({ port: 8080, host: "::1" }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
