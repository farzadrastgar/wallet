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

interface SignUpData {
  username: string;
  password: string;
  passwordRepeat: string;
  email: string;
}

type SignUpBodySchema = Schema<JSONSchemaType<SignUpData>>;

export const signUpSchema: SignUpBodySchema = {
  body: {
    type: "object",
    properties: {
      username: {
        type: "string",
      },
      password: { type: "string" },
      passwordRepeat: { type: "string" },
      email: { type: "string", format: "email" },
    },
    required: ["username", "password", "passwordRepeat", "email"],
    additionalProperties: false,
  },
};
