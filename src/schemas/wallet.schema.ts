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