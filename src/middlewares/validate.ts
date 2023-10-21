import Ajv, { JSONSchemaType } from "ajv";
import { Request, Response, NextFunction } from "express";

type Key = "body" | "param" | "query";
export type Schema<T> = Partial<Record<Key, T>>;

const ajv = new Ajv();
const validate = <T>(schema: Schema<JSONSchemaType<T>>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let validationError = [];
      if (schema.body) {
        let data = req.body;
        ajv.validate(schema.body, data);
        console.log(1171);
        ajv.errors ? validationError.push(ajv.errors) : "";
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
