import { FastifyInstance } from "fastify";
import { Type } from '@sinclair/typebox';
import createError from '@fastify/error';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

const myError = createError("MY_ERROR_TYPE", "My Error:");

export default async function schemaPlugin(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post(
    '/',
    {
      schema: {
        body: Type.Object({
          userName: Type.String(),
          email: Type.Optional(Type.String({ format: 'email' })),
        }),
        response: {
          200: Type.Object({
            id: Type.Integer(),
            fullName: Type.String(),
          }),
          500: Type.Object({
            statusCode: Type.Integer(),
            error: Type.String(),
            message: Type.String(),
          }),
        }
      },
      schemaErrorFormatter: (err, dataVar) => {
        return new myError(`An occurred, ${err[0].message}, ${dataVar}`);
      },
      errorHandler: (err, req, rep) => {
        return rep.status(500).send({
          statusCode: 500,
          error: "MY_ERROR",
          message: "A failure has in error handler",
        });
      }
    },
    async (req, rep) => {
      if (req.validationError) {
        return rep.status(500).send({
          statusCode: 500,
          error: "MY_ERROR",
          message: "A failure has occurred",
        });
      }

      return {
        id: 11,
        fullName: `Mr. ${req.body.userName}`,
      };
    }
  );
};
