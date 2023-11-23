import { FastifyInstance } from "fastify";

export default async function setErrorPlugin(fastify: FastifyInstance) {
  //error 501 plugin level
  fastify.setErrorHandler((err, req, rep) => {
    rep.status(501).send("Error from plugin");
   });

   //error 502 in route level
   // if remove this errorHandler 502 its gonna fail in 501 plugin level /\
   fastify.get('/', {
    errorHandler: (err, req, rep) => {
      rep.status(502).send("Error from route /");
    }
   }, async (req, rep) => {
    throw new Error("An error has occurred");
   });
}