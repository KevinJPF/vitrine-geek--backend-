import { Endereco } from "../models/EnderecoModel";
import { EnderecoDAO } from "../dao/EnderecoDAO";
import { IFacade } from "./IFacade";

export default class EnderecoFacade implements IFacade<Endereco> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: EnderecoFacade;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): EnderecoFacade {
    if (!EnderecoFacade.instance) {
      EnderecoFacade.instance = new EnderecoFacade();
    }
    return EnderecoFacade.instance;
  }
  // #endregion

  async getAll(): Promise<Endereco[]> {
    return await EnderecoDAO.getInstance().getAll();
  }

  async getById(id: number): Promise<Endereco | null> {
    return await EnderecoDAO.getInstance().getById(id);
  }

  async create(entity: Endereco): Promise<Endereco> {
    return await EnderecoDAO.getInstance().create(entity);
  }

  async update(id: number, entity: Endereco): Promise<boolean> {
    return await EnderecoDAO.getInstance().update(id, entity);
  }

  async delete(id: number): Promise<boolean> {
    return await EnderecoDAO.getInstance().delete(id);
  }

  async getByClienteId(clienteId: number): Promise<Endereco[]> {
    return await EnderecoDAO.getInstance().getByClienteId(clienteId);
  }
}
