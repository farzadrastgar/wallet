import { JSONSchemaType } from "ajv";
import { Schema } from "../middlewares/validate";

interface LoginData {
  username: string;
  password: string;
}

type LoginBodySchema = Schema<JSONSchemaType<LoginData>>;

export const loginSchema: LoginBodySchema = {
  body: {
    type: "object",
    properties: {
      username: {
        type: "string",
      },
      password: { type: "string" },
    },
    required: ["username", "password"],
    additionalProperties: false,
  },
};
