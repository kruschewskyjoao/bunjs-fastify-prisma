import Fastify from "fastify";
import syncplugin from "./syncplugin";
import typedplugin from "./typedplugin";
import scopedplugin from "./scopedplugin";

const server = Fastify({
  logger: true
});

server.register(syncplugin);
server.register(typedplugin, {
  prefix: "v1",
  myval: 'good bye'
});

server.register(scopedplugin)

server.listen({ port: 8080, host: "::1" }, async (err, address) => {
  if (err) {
    server.log.info(`An error occurred ${err}`);
    process.exit(1);
  }
  server.log.info(`Address is ${address}`);
});
