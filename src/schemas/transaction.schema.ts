import { JSONSchemaType } from "ajv";

// Define the type for your query (empty object in this case)
export type TransactionQuery = {};

// AJV schema
export const transactionQuerySchema: JSONSchemaType<TransactionQuery> = {
    type: "object",
    properties: {},           // no query parameters required
    additionalProperties: false, // forbid any unexpected query params
};