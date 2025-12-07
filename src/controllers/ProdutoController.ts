import { Request, Response } from "express";
import { Produto } from "../models/ProdutoModel";
import ProdutoFacade from "../facades/ProdutoFacade";

const validarCamposObrigatorios = (produto: any) => {
  const requiredFields = [
    "codigo",
    "nome_produto",
    "fabricante_id",
    "ano_lancamento",
    "descricao",
    "codigo_barras",
    "altura",
    "largura",
    "profundidade",
    "peso",
    "grupo_precificacao_id",
    "valor_venda",
    "quantidade_disponivel",
    "ativo",
  ];

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
  const novoProduto = new Produto(
    req.body.codigo,
    req.body.nome_produto,
    req.body.fabricante_id,
    req.body.ano_lancamento,
    req.body.descricao,
    req.body.codigo_barras,
    req.body.altura,
    req.body.largura,
    req.body.profundidade,
    req.body.peso,
    req.body.grupo_precificacao_id,
    req.body.valor_venda,
    req.body.quantidade_disponivel,
    req.body.ativo,
    "",
    req.body.categorias,
    req.body.imagens
  );

  // Cria o cartão no banco de dados
  const newCartao = await ProdutoFacade.getInstance().create(novoProduto);

  // Retorna o cartão criado caso sucesso
  res.status(201).json(newCartao);
};

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
  const novoProduto = new Produto(
    req.body.codigo,
    req.body.nome_produto,
    req.body.fabricante_id,
    req.body.ano_lancamento,
    req.body.descricao,
    req.body.codigo_barras,
    req.body.altura,
    req.body.largura,
    req.body.profundidade,
    req.body.peso,
    req.body.grupo_precificacao_id,
    req.body.valor_venda,
    req.body.quantidade_disponivel,
    req.body.ativo,
    "",
    req.body.categorias,
    req.body.imagens
  );

  // Verifica se o cartão existe
  const cartaoExistente = await ProdutoFacade.getInstance().getById(id);
  if (!cartaoExistente) {
    return res.status(404).json({ message: "Cartão não encontrado" });
  }

  // Atualiza o cartão no banco de dados
  const updatedCartao = await ProdutoFacade.getInstance().update(id, {
    ...novoProduto,
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

export const getGruposPrecificacao = async (req: Request, res: Response) => {
  const grupos = await ProdutoFacade.getInstance().getGruposPrecificacao();
  res.json(grupos);
};

export const ativarProduto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produtoExistente = await ProdutoFacade.getInstance().getById(id);
  if (!produtoExistente) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }
  await ProdutoFacade.getInstance().ativarProduto(id, 1, "Ativacao manual");
  res.status(200).json({ message: "Produto ativado com sucesso" });
};

export const desativarProduto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produtoExistente = await ProdutoFacade.getInstance().getById(id);
  if (!produtoExistente) {
    return res.status(404).json({ message: "Produto não encontrado" });
  }
  await ProdutoFacade.getInstance().desativarProduto(
    id,
    1,
    "Desativacao manual"
  );
  res.status(200).json({ message: "Produto desativado com sucesso" });
};

export const getAllLogsProduto = async (req: Request, res: Response) => {
  const logs = await ProdutoFacade.getInstance().getAllLogsProduto();
  res.json(logs);
};
