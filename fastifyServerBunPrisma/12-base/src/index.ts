import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

server.listen({
  port: Number(process.env.PORT),
  host: process.env.HOST,
}, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info('lets go');
});
