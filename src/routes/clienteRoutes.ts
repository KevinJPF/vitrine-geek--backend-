import { Router } from "express";
import {
  getClientes,
  createCliente,
  getClientePorId,
  updateCliente,
  deleteCliente,
} from "../controllers/ClienteController";

const router = Router();

router.get("/", getClientes); // localhost:3000/clientes
router.get("/:id", getClientePorId);
router.post("/", createCliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;
