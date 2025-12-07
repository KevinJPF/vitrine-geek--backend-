import { Produto } from "./../models/ProdutoModel";
import { ProdutoCarrinho } from "../models/ProdutoCarrinhoModel";
import { CarrinhoDAO } from "../dao/CarrinhoDAO";
import { IFacade } from "./IFacade";
import { ProdutoDAO } from "../dao/ProdutoDAO";
import ProdutoFacade from "./ProdutoFacade";

export default class CarrinhoFacade implements IFacade<ProdutoCarrinho> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: CarrinhoFacade;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): CarrinhoFacade {
    if (!CarrinhoFacade.instance) {
      CarrinhoFacade.instance = new CarrinhoFacade();
    }
    return CarrinhoFacade.instance;
  }
  // #endregion

  // Não utilizado
  async getAll(): Promise<ProdutoCarrinho[]> {
    return await CarrinhoDAO.getInstance().getAll();
  }

  // Não utilizado
  async getById(id: number): Promise<ProdutoCarrinho | null> {
    return await CarrinhoDAO.getInstance().getById(id);
  }

  async create(produto: ProdutoCarrinho): Promise<{ [key: string]: any }> {
    console.log("Facade - Criando carrinho:", produto);
    let camposInvalidos: string = "";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) }; // Remove a última vírgula ', '
    }
    // return {};
    await CarrinhoDAO.getInstance().create(produto);
    return {};
  }

  async update(
    id: number,
    produto: ProdutoCarrinho
  ): Promise<{ [key: string]: any }> {
    let camposInvalidos: string = "";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) }; // Remove a última vírgula ', '
    }

    const produtoOriginal = await ProdutoFacade.getInstance().getById(
      produto.produto_id
    );

    if (
      produto.quantidade > produtoOriginal?.quantidade_disponivel! ||
      produto.quantidade <= 0
    ) {
      return { status: "erro_quantidade_indisponivel" };
    }

    await CarrinhoDAO.getInstance().update(id, produto);
    return {};
  }

  // Não utilizado
  async delete(id: number): Promise<boolean> {
    return await CarrinhoDAO.getInstance().delete(id);
  }

  async getByClienteId(cliente_id: number): Promise<ProdutoCarrinho[]> {
    const produtosCarrinho = await CarrinhoDAO.getInstance().getByClienteId(
      cliente_id
    );
    if (produtosCarrinho.length > 0) {
      await Promise.all(
        produtosCarrinho.map(async (produtoCarrinho) => {
          const dadosProduto = await ProdutoFacade.getInstance().getById(
            produtoCarrinho.produto_id
          );
          if (!dadosProduto) {
            return;
          }
          produtoCarrinho.nome_produto = dadosProduto.nome_produto;
          produtoCarrinho.valor_venda = dadosProduto.valor_venda;
          produtoCarrinho.url_imagem = dadosProduto.imagens.find(
            (img) => img.principal
          )?.url_imagem;
        })
      );
    }
    return produtosCarrinho;
  }

  async getByProdutoId(
    cliente_id: number,
    produto_id: number
  ): Promise<ProdutoCarrinho | null> {
    const dadosProduto = await CarrinhoDAO.getInstance().getByProdutoId(
      cliente_id,
      produto_id
    );

    return dadosProduto;
  }

  async deleteProdutoCarrinho(
    cliente_id: number,
    produto_id: number
  ): Promise<boolean> {
    return await CarrinhoDAO.getInstance().deleteProdutoCarrinho(
      cliente_id,
      produto_id
    );
  }
}
