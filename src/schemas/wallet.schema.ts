import { JSONSchemaType } from "ajv";

interface WalletQuery {
    userId: string;
}

export const walletQuerySchema: JSONSchemaType<WalletQuery> = {
    type: "object",
    properties: {
        userId: { type: "string", minLength: 1 }
    },
    required: ["userId"],
    additionalProperties: false
};

interface BuyGoldRequest {
    amountEUR: number;
    idempotencyKey?: string;
}

export const buyGoldSchema: JSONSchemaType<BuyGoldRequest> = {
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

export const sellGoldSchema: JSONSchemaType<BuyGoldRequest> = {
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