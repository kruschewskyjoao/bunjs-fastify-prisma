import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { Status404, ErrorCodeType, Status500 } from "../ResponseTypes";

const profileRoute: FastifyPluginAsync = async function (fastify) {
  const instance = fastify.withTypeProvider<TypeBoxTypeProvider>();

  instance.get(
    "/profile/:userName",
    {
      schema: {
        params: Type.Object({
          userName: Type.String(),
        }),
        response: {
          200: Type.Object({
            id: Type.Integer(),
            updatedAt: Type.String(),
            userName: Type.String(),
            fullName: Type.String(),
            description: Type.Optional(Type.String()),
            region: Type.Optional(Type.String()),
            mainUrl: Type.Optional(Type.String()),
            avatar: Type.Optional(Type.String({ contentEncoding: "base64" })),
          }),
          404: ErrorCodeType,
        },
      },
    },
    async (req, rep) => {
      try {
        const result = await instance.repo.profileRepo.selectProfile(
          req.params.userName
        );

        if (!result) {
          return rep.status(404).send({
            ...Status404,
            message: "profile not found",
          });
        }

        return rep.status(200).send({
          id: Number(result.id),
          updatedAt: result.updatedAt.toISOString(),
          userName: result.userName,
          fullName: result.fullName,
          description: result.description || undefined,
          region: result.region || undefined,
          mainUrl: result.mainUrl || undefined,
          avatar: result?.avatar?.toString("base64") || undefined,
        });
      } catch (e) {
        instance.log.error(`get profile route error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.post(
    "/profile",
    {
      schema: {
        body: Type.Object({
          userName: Type.String(),
          fullName: Type.String(),
          description: Type.Optional(Type.String()),
          region: Type.Optional(Type.String()),
          mainUrl: Type.Optional(Type.String()),
          avatar: Type.Optional(Type.String({ contentEncoding: "base64" })),
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
        const { userName, fullName, description, region, mainUrl, avatar } =
          req.body;
        const result = await instance.repo.profileRepo.insertProfile(
          userName,
          fullName,
          description,
          region,
          mainUrl,
          avatar ? Buffer.from(avatar, "base64") : undefined
        );

        return rep.status(200).send({
          id: Number(result.id),
        });
      } catch (e) {
        instance.log.error(`insert profile error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.get(
    "/followed/:followerId",
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
              userName: Type.String(),
              fullName: Type.String(),
              description: Type.Optional(Type.String()),
              region: Type.Optional(Type.String()),
              mainUrl: Type.Optional(Type.String()),
              avatar: Type.Optional(Type.String({ contentEncoding: "base64" })),
            })
          ),
          404: ErrorCodeType,
        },
      },
    },
    async (req, rep) => {
      try {
        const { followerId } = req.params;
        const result = await instance.repo.profileRepo.selectFollowedProfile(
          BigInt(followerId)
        );

        if (result.length === 0) {
          return rep.status(404).send({
            statusCode: 404,
            error: "not found",
            message: "profile not found",
          });
        }

        return rep.status(200).send(
          result.map((profile) => ({
            id: Number(profile.id),
            updatedAt: profile.updatedAt.toISOString(),
            userName: profile.userName,
            fullName: profile.fullName,
            description: profile.description || undefined,
            region: profile.region || undefined,
            mainUrl: profile.mainUrl || undefined,
            avatar: profile.avatar?.toString("base64"),
          }))
        );
      } catch (e) {
        instance.log.error(`followed route erro: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.get(
    "/followers/:followedId",
    {
      schema: {
        params: Type.Object({
          followedId: Type.Integer(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Integer(),
              updatedAt: Type.String(),
              userName: Type.String(),
              fullName: Type.String(),
              description: Type.Optional(Type.String()),
              region: Type.Optional(Type.String()),
              mainUrl: Type.Optional(Type.String()),
              avatar: Type.Optional(Type.Any()),
            })
          ),
          404: ErrorCodeType,
        },
      },
    },
    async (req, rep) => {
      try {
        const result = await instance.repo.profileRepo.selectFollowerProfile(
          BigInt(req.params.followedId)
        );

        if (result.length === 0) {
          return rep.status(404).send({
            ...Status404,
            message: "no followers found",
          });
        }

        return rep.status(200).send(
          result.map((profile) => ({
            id: Number(profile.id),
            updatedAt: profile.updatedAt.toISOString(),
            userName: profile.userName,
            fullName: profile.fullName,
            description: profile.description || undefined,
            region: profile.region || undefined,
            mainUrl: profile.mainUrl || undefined,
            avatar: profile.avatar || undefined,
          }))
        );
      } catch (e) {
        instance.log.error(`followers error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );

  instance.post(
    "/follow",
    {
      schema: {
        body: Type.Object({
          followerId: Type.Integer(),
          followedId: Type.Integer(),
        }),
        response: {
          200: Type.Object({
            followId: Type.Integer(),
          }),
          500: ErrorCodeType,
        },
      },
    },
    async (req, rep) => {
      try {
        const { followerId, followedId } = req.body;
        const result = await instance.repo.profileRepo.insertFollow(
          BigInt(followerId),
          BigInt(followedId)
        );

        return rep.status(200).send({
          followId: Number(result.id),
        });
      } catch (e) {
        instance.log.error(`follow route error: ${e}`);
        return rep.status(500).send(Status500);
      }
    }
  );
};
export default profileRoute;
