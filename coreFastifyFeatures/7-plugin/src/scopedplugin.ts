import { FastifyPluginAsync, FastifyInstance } from "fastify";

const scopedplugin: FastifyPluginAsync = async function (fastify: FastifyInstance) {
  fastify.decorate("sharedval", 35);
  fastify.log.info(`parent's ${fastify.sharedval}`);
  fastify.log.info(`parent's childsharedval ${fastify.childsharedval && fastify.childsharedval}`);


  fastify.register((childfastify: FastifyInstance, options: any, done: () => void) => {
    childfastify.decorate("childsharedval", () => 86);
    childfastify.log.info(`child's childsharedval ${childfastify.childsharedval}`);
    childfastify.log.info(`child'd sharedval ${childfastify.sharedval && childfastify.sharedval}`)
    done();
  });
};

export default scopedplugin;
