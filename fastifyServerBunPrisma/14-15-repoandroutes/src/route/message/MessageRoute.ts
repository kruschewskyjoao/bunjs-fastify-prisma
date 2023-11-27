import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { ErrorCodeType, Status500, Status404 } from "../ResponseTypes";

const messageRoute: FastifyPluginAsync = async function (
  fastify: FastifyInstance
) {
  const instance = fastify.withTypeProvider<TypeBoxTypeProvider>();

  instance.get(
    "/followedmsgs/:followerId",
    {
      schema: {
        params: Type.Object({
          followerId: Type.Integer(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Integer(),
              updatedAt: Type.String(),
              authorId: Type.Integer(),
              body: Type.String(),
              likes: Type.Integer(),
              image: Type.Optional(Type.Any()),
            })
          ),
          404: ErrorCodeType,
        },
      },
    },
    async (req, rep) => {
      try {
        const result =
          await instance.repo.messageRepo.selectMessagesFromFollowed(
            BigInt(req.params.followerId)
          );

        if (result.length === 0) {
          return rep.status(404).send({
            ...Status404,
            message: "followed messages not found",
          });
        }

        return rep.status(200).send(
          result.map((message) => ({
            id: Number(message.id),
            updatedAt: message.updatedAt.toISOString(),
            authorId: Number(message.authorId),
            body: message.body,
            likes: message.likes,
            image: message.image,
          }))
        );
      } catch (e) {
        instance.log.error(`followed messages error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.get(
    "/authormsgs/:authorId",
    {
      schema: {
        params: Type.Object({
          authorId: Type.Integer(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Integer(),
              updatedAt: Type.String(),
              authorId: Type.Integer(),
              body: Type.String(),
              likes: Type.Integer(),
              image: Type.Any(),
            })
          ),
          404: ErrorCodeType,
        },
      },
    },
    async (req, rep) => {
      try {
        const { authorId } = req.params;
        const result =
          await instance.repo.messageRepo.selectedMessagesByAuthorId(
            BigInt(authorId)
          );

        if (result.length === 0) {
          return rep.status(404).send({
            ...Status404,
            message: "failed to find author messages",
          });
        }

        return rep.status(200).send(
          result.map((msg) => {
            return {
              id: Number(msg.id.toString()),
              updatedAt: msg.updatedAt.toISOString(),
              authorId: Number(msg.authorId.toString()),
              body: msg.body,
              likes: msg.likes,
              image: msg.image,
            };
          })
        );
      } catch (e) {
        instance.log.error(`author Messages Error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.get(
    "/responsemsgs/:respondedMsgId",
    {
      schema: {
        params: Type.Object({
          respondedMsgId: Type.Integer(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Integer(),
              updatedAt: Type.String(),
              authorId: Type.Integer(),
              body: Type.String(),
              likes: Type.Integer(),
              image: Type.Any(),
            })
          ),
          404: ErrorCodeType,
        },
      },
    },
    async (req, rep) => {
      try {
        const { respondedMsgId } = req.params;
        const result = await instance.repo.messageRepo.selectMessagesResponses(
          BigInt(respondedMsgId)
        );

        if (result.length === 0) {
          return rep.status(404).send({
            ...Status404,
            message: "fail to find responder messages",
          });
        }

        return rep.status(200).send(
          result.map((msg) => {
            return {
              id: Number(msg.responderMsg.id.toString()),
              updatedAt: msg.responderMsg.updatedAt.toISOString(),
              authorId: Number(msg.responderMsg.authorId.toString()),
              body: msg.responderMsg.body,
              likes: msg.responderMsg.likes,
              image: msg.responderMsg.image,
            };
          })
        );
      } catch (e) {
        instance.log.error(`error to find responder: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.get(
    "/broadcastermsgs/:broadcastId",
    {
      schema: {
        params: Type.Object({
          broadcastId: Type.Integer(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Integer(),
              updatedAt: Type.String(),
              authorId: Type.Integer(),
              body: Type.String(),
              likes: Type.Integer(),
              image: Type.Optional(Type.Any()),
            })
          ),
          404: ErrorCodeType,
        },
      },
    },
    async (req, rep) => {
      try {
        const result = await instance.repo.messageRepo.selectMessageBroadcasts(
          BigInt(req.params.broadcastId)
        );

        if (result.length === 0) {
          return rep.status(404).send({
            ...Status404,
            message: "broadcasters not found",
          });
        }

        return rep.status(200).send(
          result.map((message) => ({
            id: Number(message.broadcasterMsg.id),
            updatedAt: message.broadcasterMsg.updatedAt.toISOString(),
            authorId: Number(message.broadcasterMsg.authorId),
            body: message.broadcasterMsg.body,
            likes: message.broadcasterMsg.likes,
            image: message.broadcasterMsg.image,
          }))
        );
      } catch (e) {
        instance.log.error(`error to find broadcasters: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.post("/message",
    {
      schema: {
        body: Type.Object({
          authorId: Type.Integer(),
          body: Type.String(),
          image: Type.Optional(Type.Any()),
          respondedMsgId: Type.Optional(Type.Integer()),
          broadcastMsgId: Type.Optional(Type.Integer()),
          additionalMessage: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({
            id: Type.Integer(),
          }),
          500: ErrorCodeType,
        },
      },
    },
    async (req, rep) => {
      try {
        const {
          authorId,
          body,
          image,
          respondedMsgId,
          broadcastMsgId,
          additionalMessage,
        } = req.body;
        const result = await instance.repo.messageRepo.insertMessage(
          BigInt(authorId),
          body,
          image,
          respondedMsgId ? BigInt(respondedMsgId) : undefined,
          broadcastMsgId ? BigInt(broadcastMsgId) : undefined,
          additionalMessage
        );

        return rep.status(200).send({
          id: Number(result.id),
        });
      } catch (e) {
        instance.log.error(`error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );
};

export default messageRoute;
