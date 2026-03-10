import { JSONSchemaType } from "ajv";

// --------------------
// Login Schema
// --------------------
interface LoginData {
  username: string;
  password: string;
}

export const loginSchema: JSONSchemaType<LoginData> = {
  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  required: ["username", "password"], // include all required properties
  additionalProperties: false,
};
// --------------------
// Signup Schema
// --------------------

interface SignUpData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export const signUpSchema: JSONSchemaType<SignUpData> = {

  type: "object",
  properties: {
    username: { type: "string" },
    password: { type: "string" },
    confirmPassword: { type: "string" },
    email: { type: "string" },
  },
  required: ["username", "password", "confirmPassword", "email"],
  additionalProperties: false,

};