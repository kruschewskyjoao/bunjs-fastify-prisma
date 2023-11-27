import { Type } from "@sinclair/typebox";

export const Status404 = {
  statusCode: 404,
  error: "not found",
  message: "not found error",
};

export const Status500 = {
  statusCode: 500,
  error: "internal server",
  message: "internal server error has occurred",
};

export const ErrorCodeType = Type.Object({
  statusCode: Type.Integer(),
  error: Type.String(),
  message: Type.String(),
});
