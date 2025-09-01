import { Router } from "express";
import {
  getEnderecos,
  createEndereco,
  getEnderecoPorId,
  updateEndereco,
  deleteEndereco,
} from "../controllers/EnderecoController";

const router = Router();

// ! Apenas para testes - DELETAR DEPOIS
router.get("/", getEnderecos); // localhost:3000/enderecos
router.get("/:id", getEnderecoPorId);
router.post("/", createEndereco);
router.put("/:id", updateEndereco);
router.delete("/:id", deleteEndereco);

export default router;
