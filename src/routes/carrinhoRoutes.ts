import { Router } from "express";
import {
  createCarrinho,
  updateCarrinho,
  deleteProdutoCarrinho,
  getCarrinhoByClienteId,
} from "../controllers/CarrinhoController";

const router = Router();

// ! Apenas para testes - DELETAR DEPOIS
router.get("/:id", getCarrinhoByClienteId);
router.post("/", createCarrinho);
router.put("/:id", updateCarrinho);
router.post("/delete", deleteProdutoCarrinho);

export default router;
