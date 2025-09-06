import { Request, Response } from "express";
import { Cartao } from "../models/CartaoModel";
import CartaoFacade from "../facades/CartaoFacade";

const validarCamposObrigatorios = (cartao: any) => {
  const requiredFields = [
    "numero",
    "nome_titular",
    "data_validade",
    "cvv",
    "bandeira",
  ];

  const missingFields = requiredFields.filter(
    (field) => !Object.prototype.hasOwnProperty.call(cartao, field)
  );

  return missingFields;
};

export const getCartoes = async (req: Request, res: Response) => {
  const cartoes = await CartaoFacade.getInstance().getAll();
  res.json(cartoes);
};

export const getCartaoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cartao = await CartaoFacade.getInstance().getById(id);
  if (!cartao) {
    return res.status(404).json({ message: "Cartão não encontrado" });
  }
  res.json(cartao);
};

export const createCartao = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  // Variável com valor de cartão enviado pela requisição
  const novoCartao = new Cartao(
    req.body.numero,
    req.body.nome_titular,
    req.body.data_validade,
    req.body.cvv,
    req.body.bandeira,
    req.body.favorito,
    req.body.id_cliente
  );

  // Cria o cartão no banco de dados
  const newCartao = await CartaoFacade.getInstance().create(novoCartao);

  // Retorna o cartão criado caso sucesso
  res.status(201).json(newCartao);
};

export const updateCartao = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  const id = Number(req.params.id);
  const novoCartao = new Cartao(
    req.body.numero,
    req.body.nome_titular,
    req.body.data_validade,
    req.body.cvv,
    req.body.bandeira,
    req.body.favorito,
    req.body.id_cliente
  );

  // Verifica se o cartão existe
  const cartaoExistente = await CartaoFacade.getInstance().getById(id);
  if (!cartaoExistente) {
    return res.status(404).json({ message: "Cartão não encontrado" });
  }

  // Atualiza o cartão no banco de dados
  const updatedCartao = await CartaoFacade.getInstance().update(id, {
    ...novoCartao,
  });

  res.json(updatedCartao);
};

export const deleteCartao = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cartaoExistente = await CartaoFacade.getInstance().getById(id);
  if (!cartaoExistente) {
    return res.status(404).json({ message: "Cartão não encontrado" });
  }

  res.status(200).send(await CartaoFacade.getInstance().delete(id));
};

export const getBandeiras = async (req: Request, res: Response) => {
  const cartoes = await CartaoFacade.getInstance().getBandeiras();
  res.json(cartoes);
};
