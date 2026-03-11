"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellGoldSchema = exports.buyGoldSchema = exports.walletQuerySchema = void 0;
exports.walletQuerySchema = {
    type: "object",
    properties: {
        userId: { type: "string", minLength: 1 }
    },
    required: ["userId"],
    additionalProperties: false
};
exports.buyGoldSchema = {
    type: "object",
    properties: {
        amountEUR: {
            type: "number",
            minimum: 0.01,
        },
        idempotencyKey: {
            type: "string",
            nullable: true,
        },
    },
    required: ["amountEUR"],
    additionalProperties: false,
};
exports.sellGoldSchema = {
    type: "object",
    properties: {
        amountGold: {
            type: "number",
            minimum: 0.01,
        },
        idempotencyKey: {
            type: "string",
            nullable: true,
        },
    },
    required: ["amountGold"],
    additionalProperties: false,
};
