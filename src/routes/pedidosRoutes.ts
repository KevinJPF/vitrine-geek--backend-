import { Router } from "express";
import {
  getPedidos,
  getPedidosByClienteId,
  getPedidoPorId,
  createPedido,
  updatePedido,
  getCupomByCodigo,
  getPedidosPeriodo,
} from "../controllers/PedidoController";

const router = Router();

router.get("/periodo", getPedidosPeriodo);
router.get("/", getPedidos);
router.get("/cliente/:id", getPedidosByClienteId);
router.get("/cupom", getCupomByCodigo);
router.get("/:id", getPedidoPorId);
router.post("/", createPedido);
router.patch("/:id", updatePedido);

export default router;
