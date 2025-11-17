import { Router } from "express";
import { sendMessage } from "../controllers/iaController";

const router = Router();
// const controller = new IaController();

router.post("/", sendMessage); // localhost:3000/chat

export default router;
