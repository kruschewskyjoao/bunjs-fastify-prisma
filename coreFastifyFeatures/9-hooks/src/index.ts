import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyAuth from '@fastify/auth';
import hooksplugin from './hooksplugin';

const server = Fastify({
  logger: true,
});

server.register(fastifyAuth);

server.decorate("authenticateUser",
  (
    req: FastifyRequest<{ Body: { userName: string, password: string }}>,
    rep: FastifyReply,
    done: () => void
  ) => {
    if (req.body.userName !== "admin" || req.body.password !== "admin") {
      return rep.status(401).send("Unauthorized");
    } 
  done();
});

server.register(hooksplugin);

server.listen({ port: 8080, host: '::1' }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  };
});
