import { Cartao } from "../models/CartaoModel";
import { CartaoDAO } from "./../dao/CartaoDAO";
import { IFacade } from "./IFacade";

export default class CartaoFacade implements IFacade<Cartao> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: CartaoFacade;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): CartaoFacade {
    if (!CartaoFacade.instance) {
      CartaoFacade.instance = new CartaoFacade();
    }
    return CartaoFacade.instance;
  }
  // #endregion

  async getAll(): Promise<Cartao[]> {
    return await CartaoDAO.getInstance().getAll();
  }

  async getById(id: number): Promise<Cartao | null> {
    return await CartaoDAO.getInstance().getById(id);
  }

  async create(entity: Cartao): Promise<Cartao> {
    return await CartaoDAO.getInstance().create(entity);
  }

  async update(id: number, entity: Cartao): Promise<boolean> {
    return await CartaoDAO.getInstance().update(id, entity);
  }

  async delete(id: number): Promise<boolean> {
    return await CartaoDAO.getInstance().delete(id);
  }

  async getByClienteId(clienteId: number): Promise<Cartao[]> {
    return await CartaoDAO.getInstance().getByClienteId(clienteId);
  }
}
