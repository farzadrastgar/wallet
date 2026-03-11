"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = exports.loginSchema = void 0;
exports.loginSchema = {
    type: "object",
    properties: {
        username: { type: "string" },
        password: { type: "string" },
    },
    required: ["username", "password"], // include all required properties
    additionalProperties: false,
};
exports.signUpSchema = {
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
