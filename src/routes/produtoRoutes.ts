import { Router } from "express";
import {
  getProdutos,
  getProdutoPorId,
  createProduto,
  updateProduto,
  deleteProduto,
  getCategorias,
} from "../controllers/ProdutoController";

const router = Router();

// ! Apenas para testes - DELETAR DEPOIS
router.get("/", getProdutos); // localhost:3000/cartoes
router.get("/categorias", getCategorias);
router.get("/:id", getProdutoPorId);
// router.post("/", createProduto);
// router.put("/:id", updateProduto);
// router.delete("/:id", deleteProduto);

export default router;
