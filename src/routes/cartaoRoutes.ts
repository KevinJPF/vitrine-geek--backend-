import { Router } from "express";
import {
  getCartoes,
  getCartaoPorId,
  createCartao,
  updateCartao,
  deleteCartao,
  getBandeiras,
} from "../controllers/CartaoController";

const router = Router();

// ! Apenas para testes - DELETAR DEPOIS
router.get("/", getCartoes); // localhost:3000/cartoes
router.get("/bandeiras", getBandeiras);
router.get("/:id", getCartaoPorId);
router.post("/", createCartao);
router.put("/:id", updateCartao);
router.delete("/:id", deleteCartao);

export default router;
