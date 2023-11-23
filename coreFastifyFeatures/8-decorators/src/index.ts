import Fastify from "fastify";
import decorators from "./decorators";

const server = Fastify({
  logger: true
});

server.register(decorators);

server.listen({ port: 8080, host: "::1" }, async (err, address) => {
  if (err) {
    server.log.info(`An error occurred ${err}`);
    process.exit(1);
  }
  server.log.info(`Address is ${address}`);
});
