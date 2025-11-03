import { Router } from "express";
import {
  getPedidos,
  getPedidosByClienteId,
  getPedidoPorId,
  createPedido,
  updatePedido,
} from "../controllers/PedidoController";
import { getCarrinhoPorId } from "../controllers/CarrinhoController";

const router = Router();

// ! Apenas para testes - DELETAR DEPOIS
router.get("/", getPedidos);
router.get("/cliente/:id", getPedidosByClienteId);
router.get("/:id", getPedidoPorId);
router.post("/", createPedido);
router.patch("/:id", updatePedido);

export default router;
