import { Router } from "express";
import { login, register } from "../../controllers/auth.controller";
import validate from "../../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../../schemas/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
