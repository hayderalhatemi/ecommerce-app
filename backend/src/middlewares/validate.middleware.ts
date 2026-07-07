import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";

// Validates req.body (and optionally req.params/query) against a Zod schema
const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query });
      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        res.status(400).json({ errors: err.issues.map((e) => e.message) });
      } else {
        next(err);
      }
    }
  };

export default validate;
