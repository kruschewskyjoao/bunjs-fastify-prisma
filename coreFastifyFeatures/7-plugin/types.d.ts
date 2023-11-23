import { FastifyInstance as RealFastifyInstance } from "fastify";

declare module 'fastify' {
  export interface FastifyInstance extends RealFastifyInstance {
    sharedval: number,
    childsharedval: () => number,
  }
}
