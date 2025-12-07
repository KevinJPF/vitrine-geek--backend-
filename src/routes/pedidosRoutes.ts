import { Router } from "express";
import {
  getPedidos,
  getPedidosByClienteId,
  getPedidoPorId,
  createPedido,
  updatePedido,
  getCupomByCodigo,
  getPedidosPeriodo,
  realizarTroca,
  getAllLogsPedido,
} from "../controllers/PedidoController";

const router = Router();

router.get("/periodo", getPedidosPeriodo);
router.get("/logs", getAllLogsPedido);
router.get("/", getPedidos);
router.get("/cliente/:id", getPedidosByClienteId);
router.get("/cupom", getCupomByCodigo);
router.get("/:id", getPedidoPorId);
router.post("/", createPedido);
router.patch("/:id", updatePedido);
router.patch("/trocar/:id", realizarTroca);

export default router;
