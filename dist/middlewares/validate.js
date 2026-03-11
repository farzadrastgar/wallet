"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default({ $data: true, allErrors: true }); // collect all errors
(0, ajv_formats_1.default)(ajv);
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validationErrors = [];
            if (schema.body) {
                const valid = ajv.validate(schema.body, req.body);
                if (!valid && ajv.errors) {
                    validationErrors.push(...ajv.errors);
                }
            }
            if (validationErrors.length === 0) {
                return next();
            }
            // Format AJV errors into readable messages
            const errors = validationErrors.map(err => ({
                path: err.instancePath,
                message: err.message,
            }));
            return res.status(400).json({ errors });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server Error" });
        }
    };
};
exports.default = validate;
