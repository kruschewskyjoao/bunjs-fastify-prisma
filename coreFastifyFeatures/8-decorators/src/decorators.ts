import { FastifyInstance, FastifyPluginAsync } from "fastify";

const decorators: FastifyPluginAsync = async function (fastify: FastifyInstance) {
  fastify.decorateRequest("reqvar", 33);
  fastify.decorateReply("repvar", (val: number) => `you gave ${val}`);

  fastify.get("/", async (req, rep) => {
    fastify.log.info(`reqvar ${req.reqvar} repvar ${rep.repvar(777)}`)
    return;
  });
}

export default decorators;
