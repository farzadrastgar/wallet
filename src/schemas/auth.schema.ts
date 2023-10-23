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
  confirmPassword: string;
  email: string;
}

type SignUpBodySchema = Schema<JSONSchemaType<SignUpData>>;

export const signUpSchema: SignUpBodySchema = {
  body: {
    type: "object",
    properties: {
      username: {
        type: "string",
        minLength: 12,
        maxLength: 40,
      },
      password: { type: "string", minLength: 8 },
      confirmPassword: {
        type: "string",
        // const: {
        //   $data: "1/password",
        // },
      },
      email: { type: "string", format: "email" },
    },
    required: ["username", "password", "confirmPassword", "email"],
    additionalProperties: false,
  },
};
