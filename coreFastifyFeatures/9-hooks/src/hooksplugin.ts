import { FastifyInstance } from "fastify";

export default async function hooksplugin (fastify: FastifyInstance) {
  fastify.post('/', {
    preHandler: fastify.auth([fastify.authenticateUser])
  },
  async (req, rep) => {
    return "Successfully autenticated"
  }
  )
}