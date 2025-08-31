import { Router } from "express";
import {
  getClientes,
  createCliente,
  getClientePorId,
} from "../controllers/ClienteController";

const router = Router();

router.get("/", getClientes); // localhost:3000/clientes
router.get("/:id", getClientePorId);
router.post("/", createCliente);

export default router;
