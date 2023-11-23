import { FastifyInstance as RealFastifyInstance } from 'fastify';

declare module 'fastify' {
  export interface FastifyInstance extends RealFastifyInstance {
    authenticateUser: (
      req: FastifyRequest<{ Body: {userName: string, password: string }}>,
      rep: FastifyReply,
      done: () => void
    ) => void;
  }
};
