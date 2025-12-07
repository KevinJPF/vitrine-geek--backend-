import { Produto } from "../models/ProdutoModel";
import { ProdutoDAO } from "../dao/ProdutoDAO";
import { IFacade } from "./IFacade";

export default class ProdutoFacade implements IFacade<Produto> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ProdutoFacade;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ProdutoFacade {
    if (!ProdutoFacade.instance) {
      ProdutoFacade.instance = new ProdutoFacade();
    }
    return ProdutoFacade.instance;
  }
  // #endregion

  async getAll(): Promise<Produto[]> {
    let produtos = await ProdutoDAO.getInstance().getAll();
    for (let produto of produtos) {
      produto.categorias =
        await ProdutoDAO.getInstance().getCategoriasByProdutoId(produto.id!);
      produto.imagens = await ProdutoDAO.getInstance().getImagensByProdutoId(
        produto.id!
      );
      for (let produto of produtos) {
        if (produto.quantidade_disponivel <= 0) {
          await ProdutoDAO.getInstance().desativarProduto(produto.id!, 1);
          produtos.filter((p) => p.id == produto.id)[0].ativo = false;
        }
      }
    }
    return produtos;
  }

  async getById(id: number): Promise<Produto | null> {
    let produto = await ProdutoDAO.getInstance().getById(id);

    produto!.categorias =
      await ProdutoDAO.getInstance().getCategoriasByProdutoId(produto!.id!);
    produto!.imagens = await ProdutoDAO.getInstance().getImagensByProdutoId(
      produto!.id!
    );

    return produto;
  }

  async create(produto: Produto): Promise<{ [key: string]: any }> {
    let camposInvalidos: string = "";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) }; // Remove a última vírgula ', '
    }
    // return {};

    const insertId = await ProdutoDAO.getInstance().create(produto);
    produto.id = insertId;

    await ProdutoDAO.getInstance().insertEstoqueProduto(
      produto.id!,
      produto.quantidade_disponivel!
    );

    for (const categoria of produto.categorias) {
      await ProdutoDAO.getInstance().associarCategoriaProduto(
        produto.id!,
        categoria.id
      );
    }

    for (const imagem of produto.imagens) {
      await ProdutoDAO.getInstance().adicionarImagemProduto(
        produto.id!,
        imagem
      );
    }

    return insertId ? {} : { status: "erro" };
  }

  async update(id: number, produto: Produto): Promise<{ [key: string]: any }> {
    let camposInvalidos: string = "";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) }; // Remove a última vírgula ', '
    }
    // return {};

    const produtoAtual = await this.getById(id);

    if (!produtoAtual) {
      return { status: "nao_encontrado" };
    }

    await ProdutoDAO.getInstance().update(id, produto);

    await ProdutoDAO.getInstance().updateEstoqueProduto(
      id,
      produto.quantidade_disponivel!
    );

    for (const categoria of produtoAtual.categorias) {
      await ProdutoDAO.getInstance().desassociarCategoriaProduto(
        id,
        categoria.id
      );
    }

    for (const categoria of produto.categorias) {
      await ProdutoDAO.getInstance().associarCategoriaProduto(id, categoria.id);
    }

    for (const imagem of produtoAtual.imagens) {
      await ProdutoDAO.getInstance().removerImagemProduto(id, imagem);
    }

    for (const imagem of produto.imagens) {
      await ProdutoDAO.getInstance().adicionarImagemProduto(id, imagem);
    }

    return {};
  }

  async delete(id: number): Promise<boolean> {
    return await ProdutoDAO.getInstance().delete(id);
  }

  async getCategorias(): Promise<any[]> {
    return await ProdutoDAO.getInstance().getCategorias();
  }

  async getGruposPrecificacao(): Promise<any[]> {
    return await ProdutoDAO.getInstance().getGruposPrecificacao();
  }

  async ativarProduto(
    id: number,
    categoria_ativacao_id: number,
    motivo: string
  ): Promise<boolean> {
    await ProdutoDAO.getInstance().registrarLogProduto({
      produto_id: id,
      tipo_alteracao: "ativacao",
      motivo: motivo,
      cat_ativacao: 1,
      estado_ant: false,
      estado_novo: true,
      usuario_id: 1,
    });
    return await ProdutoDAO.getInstance().ativarProduto(
      id,
      categoria_ativacao_id
    );
  }

  async desativarProduto(
    id: number,
    categoria_ativacao_id: number,
    motivo: string
  ): Promise<boolean> {
    await ProdutoDAO.getInstance().registrarLogProduto({
      produto_id: id,
      tipo_alteracao: "desativacao",
      motivo: motivo,
      cat_inativacao: 2,
      estado_ant: true,
      estado_novo: false,
      usuario_id: 1,
    });
    return await ProdutoDAO.getInstance().desativarProduto(
      id,
      categoria_ativacao_id
    );
  }

  async increaseEstoqueProduto(
    produto_id: number,
    quantidadeParaAdicionar: number,
    motivo: string
  ): Promise<boolean> {
    const produtoAtual = await this.getById(produto_id);
    await ProdutoDAO.getInstance().registrarLogProduto({
      produto_id: produto_id,
      tipo_alteracao: "aumento_estoque",
      motivo: motivo,
      estoque_ant: produtoAtual?.quantidade_disponivel!,
      estoque_novo:
        produtoAtual?.quantidade_disponivel! + quantidadeParaAdicionar,
      usuario_id: 1,
    });
    return await ProdutoDAO.getInstance().increaseEstoqueProduto(
      produto_id,
      quantidadeParaAdicionar
    );
  }

  async decreaseEstoqueProduto(
    produto_id: number,
    quantidadeParaRemover: number,
    motivo: string
  ): Promise<boolean> {
    const produtoAtual = await this.getById(produto_id);
    await ProdutoDAO.getInstance().registrarLogProduto({
      produto_id: produto_id,
      tipo_alteracao: "diminuicao_estoque",
      motivo: motivo,
      estoque_ant: produtoAtual?.quantidade_disponivel!,
      estoque_novo:
        produtoAtual?.quantidade_disponivel! - quantidadeParaRemover,
      usuario_id: 1,
    });
    return await ProdutoDAO.getInstance().decreaseEstoqueProduto(
      produto_id,
      quantidadeParaRemover
    );
  }

  async getAllLogsProduto(): Promise<any[]> {
    return await ProdutoDAO.getInstance().getAllLogsProduto();
  }
}
