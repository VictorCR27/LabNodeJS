import { Router } from "express";
import { register,verifyAccount } from "../controllers/auth.controllers.js";

const router = Router();

router.post('/register', register);

router.get('/verificar', verifyAccount);

export default router;