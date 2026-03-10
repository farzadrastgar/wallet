import Ajv, { JSONSchemaType, ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { Request, Response, NextFunction } from "express";

type Key = "body" | "param" | "query";
export type Schema<T> = Partial<Record<Key, JSONSchemaType<T>>>;

const ajv = new Ajv({ $data: true, allErrors: true }); // collect all errors
addFormats(ajv);

const validate = <T>(schema: Schema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationErrors: ErrorObject[] = [];

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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server Error" });
    }
  };
};

export default validate;