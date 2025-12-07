import { Router } from "express";
import {
  getProdutos,
  getProdutoPorId,
  createProduto,
  updateProduto,
  deleteProduto,
  getCategorias,
  getGruposPrecificacao,
  ativarProduto,
  desativarProduto,
  getAllLogsProduto,
} from "../controllers/ProdutoController";

const router = Router();

router.get("/", getProdutos);
router.get("/logs", getAllLogsProduto);
router.get("/categorias", getCategorias);
router.get("/precificacao", getGruposPrecificacao);
router.get("/:id", getProdutoPorId);
router.patch("/ativar/:id", ativarProduto);
router.patch("/desativar/:id", desativarProduto);
router.post("/", createProduto);
router.put("/:id", updateProduto);

// router.delete("/:id", deleteProduto);

export default router;
