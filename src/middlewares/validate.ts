import Ajv, { JSONSchemaType } from "ajv";
import { Request, Response, NextFunction } from "express";
import addFormats from "ajv-formats";

type Key = "body" | "param" | "query";
export type Schema<T> = Partial<Record<Key, T>>;

const ajv = new Ajv();
addFormats(ajv);

const validate = <T>(schema: Schema<JSONSchemaType<T>>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let validationError: string[] = [];
      if (schema.body) {
        let data = req.body;
        ajv.validate(schema.body, data);
        validationError = [...validationError, ...((ajv.errors as []) || [])];
      }

      if (validationError.length === 0) {
        next();
      }
      res.status(400).json({ error: validationError });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server Error" });
    }
  };
};

export default validate;
