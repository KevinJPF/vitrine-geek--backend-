import { Request, Response } from "express";
import { Produto } from "../models/ProdutoModel";
import ProdutoFacade from "../facades/ProdutoFacade";

const validarCamposObrigatorios = (produto: any) => {
  const requiredFields = ["nome_produto", "preco_produto"];

  const missingFields = requiredFields.filter(
    (field) => !Object.prototype.hasOwnProperty.call(produto, field)
  );

  return missingFields;
};

export const getProdutos = async (req: Request, res: Response) => {
  const produtos = await ProdutoFacade.getInstance().getAll();
  res.json(produtos);
};

export const getProdutoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produto = await ProdutoFacade.getInstance().getById(id);
  if (!produto) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }
  res.json(produto);
};

// Não utilizado
export const createProduto = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  // Variável com valor de produto enviado pela requisição
  const novoCartao = new Produto(
    req.body.numero,
    req.body.nome_titular,
    req.body.data_validade
  );

  // Cria o cartão no banco de dados
  const newCartao = await ProdutoFacade.getInstance().create(novoCartao);

  // Retorna o cartão criado caso sucesso
  res.status(201).json(newCartao);
};

// Não utilizado
export const updateProduto = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  const id = Number(req.params.id);
  const novoCartao = new Produto(
    req.body.numero,
    req.body.nome_titular,
    req.body.data_validade
  );

  // Verifica se o cartão existe
  const cartaoExistente = await ProdutoFacade.getInstance().getById(id);
  if (!cartaoExistente) {
    return res.status(404).json({ message: "Cartão não encontrado" });
  }

  // Atualiza o cartão no banco de dados
  const updatedCartao = await ProdutoFacade.getInstance().update(id, {
    ...novoCartao,
  });

  res.json(updatedCartao);
};

// Não utilizado
export const deleteProduto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cartaoExistente = await ProdutoFacade.getInstance().getById(id);
  if (!cartaoExistente) {
    return res.status(404).json({ message: "Cartão não encontrado" });
  }

  res.status(200).send(await ProdutoFacade.getInstance().delete(id));
};

export const getCategorias = async (req: Request, res: Response) => {
  const categorias = await ProdutoFacade.getInstance().getCategorias();
  res.json(categorias);
};
