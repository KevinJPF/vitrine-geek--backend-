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
    return await ProdutoDAO.getInstance().getAll();
  }

  async getById(id: number): Promise<Produto | null> {
    return await ProdutoDAO.getInstance().getById(id);
  }

  async create(produto: Produto): Promise<{ [key: string]: any }> {
    let camposInvalidos: string = "";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) }; // Remove a última vírgula ', '
    }
    // return {};

    return (await ProdutoDAO.getInstance().create(produto))
      ? {}
      : { status: "erro" };
  }

  async update(id: number, produto: Produto): Promise<{ [key: string]: any }> {
    let camposInvalidos: string = "";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) }; // Remove a última vírgula ', '
    }
    // return {};

    return (await ProdutoDAO.getInstance().update(id, produto))
      ? {}
      : { status: "erro" };
  }

  async delete(id: number): Promise<boolean> {
    return await ProdutoDAO.getInstance().delete(id);
  }
}
