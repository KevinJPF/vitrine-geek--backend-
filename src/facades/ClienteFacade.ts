import { Cliente } from "../models/ClienteModel";
import { ClienteDAO } from "../dao/ClienteDAO";
import { IFacade } from "./IFacade";

export default class ClienteFacade implements IFacade<Cliente> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ClienteFacade;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ClienteFacade {
    if (!ClienteFacade.instance) {
      ClienteFacade.instance = new ClienteFacade();
    }
    return ClienteFacade.instance;
  }
  // #endregion

  async getAll(): Promise<Cliente[]> {
    return await ClienteDAO.getInstance().getAll();
  }

  async getById(id: number): Promise<Cliente | null> {
    return await ClienteDAO.getInstance().getById(id);
  }

  async create(entity: Cliente): Promise<Cliente> {
    return await ClienteDAO.getInstance().create(entity);
  }

  async update(id: number, entity: Cliente): Promise<boolean> {
    return await ClienteDAO.getInstance().update(id, entity);
  }

  async delete(id: number): Promise<boolean> {
    return await ClienteDAO.getInstance().delete(id);
  }
}
