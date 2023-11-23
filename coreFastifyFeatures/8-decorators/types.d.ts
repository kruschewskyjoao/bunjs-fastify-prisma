import {
  FastifyRequest as RealFastifyRequest,
  FastifyReply as RealFastifyReply,
} from 'fastify'; 

declare module 'fastify' {
  export interface FastifyRequest extends RealFastifyRequest {
    reqvar: number;
  }
  export interface FastifyReply extends RealFastifyReply {
    repvar: (val: number) => string;
  }
}