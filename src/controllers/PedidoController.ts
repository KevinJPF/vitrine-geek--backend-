import { Request, Response } from "express";
import { Pedido } from "../models/PedidoModel";
import PedidoFacade from "../facades/PedidoFacade";

const validarCamposObrigatorios = (pedido: any) => {
  const requiredFields = [
    "id_cliente",
    "id_endereco_entrega",
    "status_id",
    "valor_produtos",
    "valor_frete",
    "valor_desconto",
    "valor_total",
    "pagamentos",
  ];

  const missingFields = requiredFields.filter(
    (field) => !Object.prototype.hasOwnProperty.call(pedido, field)
  );

  return missingFields;
};

export const getPedidos = async (req: Request, res: Response) => {
  const produtos = await PedidoFacade.getInstance().getAll();
  res.json(produtos);
};

export const getPedidosByClienteId = async (req: Request, res: Response) => {
  const clienteId = Number(req.params.id);
  const produtos = await PedidoFacade.getInstance().getPedidosByClienteId(
    clienteId
  );
  res.json(produtos);
};

export const getPedidoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produto = await PedidoFacade.getInstance().getById(id);
  if (!produto) {
    return res.status(404).json({ message: "Pedido não encontrado" });
  }
  res.json(produto);
};

// Não utilizado
export const createPedido = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  // Variável com valor de produto enviado pela requisição
  const novoCartao = new Pedido(
    req.body.id_cliente,
    req.body.id_endereco_entrega,
    req.body.status_id,
    req.body.valor_produtos,
    req.body.valor_frete,
    req.body.valor_desconto,
    req.body.valor_total,
    req.body.pagamentos,
    req.body.produtos
  );

  // Cria o cartão no banco de dados
  const newCartao = await PedidoFacade.getInstance().create(novoCartao);

  // Retorna o cartão criado caso sucesso
  res.status(201).json(newCartao);
};

export const updatePedido = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  if (req.body.status_id === undefined) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      campos_ausentes: ["status_id"],
    });
  }

  const id = Number(req.params.id);

  // Verifica se o pedido existe
  const pedidoExistente = await PedidoFacade.getInstance().getById(id);
  if (!pedidoExistente) {
    return res.status(404).json({ message: "Pedido não encontrado" });
  }

  // Atualiza o pedido no banco de dados
  const updatedPedido = await PedidoFacade.getInstance().updateStatus(
    id,
    req.body.status_id
  );

  res.json(updatedPedido);
};

// Não utilizado
export const deletePedido = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cartaoExistente = await PedidoFacade.getInstance().getById(id);
  if (!cartaoExistente) {
    return res.status(404).json({ message: "Pedido não encontrado" });
  }

  res.status(200).send(await PedidoFacade.getInstance().delete(id));
};

export const getCupomByCodigo = async (req: Request, res: Response) => {
  const codigo = req.query.codigo as string;
  console.log("Código recebido:", codigo, "Tipo:", typeof codigo);
  const cupom = await PedidoFacade.getInstance().getCupomByCodigo(
    codigo.toUpperCase()
  );
  if (!cupom) {
    return res.status(404).json({ message: "Cupom não encontrado" });
  }
  res.json(cupom);
};

export const getPedidosPeriodo = async (req: Request, res: Response) => {
  const dataInicio = req.query.dataInicio as string;
  const dataFim = req.query.dataFim as string;

  const produtoId = req.query.produtoId
    ? Number(req.query.produtoId) || null
    : null;
  const categoriaId = req.query.categoriaId
    ? Number(req.query.categoriaId) || null
    : null;

  const pedidos = await PedidoFacade.getInstance().getPedidosPeriodo(
    dataInicio,
    dataFim,
    produtoId,
    categoriaId
  );

  res.json(pedidos);
};
