import fastify, { FastifyInstance, FastifyPluginAsync } from "fastify";

export type MyVal = { myval: string };

const typedplugin: FastifyPluginAsync<MyVal> = async function (fasitfy: FastifyInstance, options: MyVal) {
  fasitfy.get('/b', async (req, rep) => {
    // fastify.log.info("inside typedplugin route handler");
    return `hello word b ${options.myval}`
  })
}

export default typedplugin;
