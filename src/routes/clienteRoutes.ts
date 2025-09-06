import { Router } from "express";
import {
  getClientes,
  createCliente,
  getClientePorId,
  updateCliente,
  deleteCliente,
  activateOrDeactivateCliente,
} from "../controllers/ClienteController";

const router = Router();

// Rota de listagem de clientes
router.get("/", getClientes); // localhost:3000/clientes

// Rota de busca de cliente por ID
router.get("/:id", getClientePorId);

// Rota de criação de cliente
router.post("/", createCliente);

// Rota de atualização de cliente
router.put("/:id", updateCliente);

// Rota de ativação/desativação de cliente
router.patch("/:id", activateOrDeactivateCliente);

// Rota de exclusão de cliente
router.delete("/:id", deleteCliente);

export default router;
