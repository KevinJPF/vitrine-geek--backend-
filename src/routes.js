import { Router } from "express";
import UserController from "./controllers/UserController.js";

const router = Router();

// Exemplo de rota com controller
router.get("/users", UserController.getAll);

export default router;
