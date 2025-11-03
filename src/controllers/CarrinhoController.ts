import { Request, Response } from "express";
import { ProdutoCarrinho } from "../models/ProdutoCarrinhoModel";
import CarrinhoFacade from "../facades/CarrinhoFacade";

const validarCamposObrigatorios = (carrinho: any) => {
  const requiredFields = ["id_cliente", "id_produto", "quantidade"];

  const missingFields = requiredFields.filter(
    (field) => !Object.prototype.hasOwnProperty.call(carrinho, field)
  );

  return missingFields;
};

// Não utilizado
export const getCarrinhos = async (req: Request, res: Response) => {
  const produtos = await CarrinhoFacade.getInstance().getAll();
  res.json(produtos);
};

// Não utilizado
export const getCarrinhoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const carrinho = await CarrinhoFacade.getInstance().getById(id);
  if (!carrinho) {
    return res.status(404).json({ message: "Carrinho não encontrado" });
  }
  res.json(carrinho);
};

export const createCarrinho = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  // Variável com valor de carrinho enviado pela requisição
  const novoCarrinho = new ProdutoCarrinho(
    req.body.id_cliente,
    req.body.id_produto,
    req.body.quantidade,
    true
  );

  // Verifica se o carrinho existe
  const carrinhoExistente = await CarrinhoFacade.getInstance().getByProdutoId(
    novoCarrinho.id_cliente,
    novoCarrinho.produto_id
  );

  if (carrinhoExistente == null) {
    // Cria o carrinho no banco de dados
    const newCarrinho = await CarrinhoFacade.getInstance().create(novoCarrinho);

    // Retorna o carrinho criado caso sucesso
    res.status(201).json(newCarrinho);
  } else {
    novoCarrinho.quantidade = carrinhoExistente.quantidade + 1;
    // Atualiza o carrinho no banco de dados
    const updatedCarrinho = await CarrinhoFacade.getInstance().update(
      novoCarrinho.id_cliente,
      {
        ...novoCarrinho,
      }
    );
    // Retorna o carrinho criado caso sucesso
    res.status(201).json(updatedCarrinho);
  }
};

export const updateCarrinho = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  const id = Number(req.params.id);
  const novoCarrinho = new ProdutoCarrinho(
    req.body.id_cliente,
    req.body.id_produto,
    req.body.quantidade,
    req.body.ativo
  );

  // Verifica se o carrinho existe
  const carrinhoExistente = await CarrinhoFacade.getInstance().getByClienteId(
    id
  );
  if (!carrinhoExistente) {
    return res.status(404).json({ message: "Carrinho não encontrado" });
  }

  // Atualiza o carrinho no banco de dados
  const updatedCarrinho = await CarrinhoFacade.getInstance().update(id, {
    ...novoCarrinho,
  });

  res.json(updatedCarrinho);
};

// Não utilizado
export const deleteCarrinho = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const carrinhoExistente = await CarrinhoFacade.getInstance().getById(id);
  if (!carrinhoExistente) {
    return res.status(404).json({ message: "Carrinho não encontrado" });
  }

  res.status(200).send(await CarrinhoFacade.getInstance().delete(id));
};

export const getCarrinhoByClienteId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const produtos = await CarrinhoFacade.getInstance().getByClienteId(id);
  res.json(produtos);
};

export const deleteProdutoCarrinho = async (req: Request, res: Response) => {
  const id_cliente = Number(req.body.id_cliente);
  const produto_id = Number(req.body.produto_id);
  const carrinhoExistente = await CarrinhoFacade.getInstance().getByProdutoId(
    id_cliente,
    produto_id
  );
  if (carrinhoExistente == null) {
    return res.status(404).json({ message: "Carrinho não encontrado" });
  }

  res
    .status(200)
    .send(
      await CarrinhoFacade.getInstance().deleteProdutoCarrinho(
        id_cliente,
        produto_id
      )
    );
};
