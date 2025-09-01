import { Cliente } from "../models/ClienteModel";
import { ClienteDAO } from "../dao/ClienteDAO";
import { IFacade } from "./IFacade";
import CartaoFacade from "./CartaoFacade";
import EnderecoFacade from "./EnderecoFacade";

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
    let clientes = await ClienteDAO.getInstance().getAll();
    for (let cliente of clientes) {
      cliente.cartoes = await CartaoFacade.getInstance().getByClienteId(
        cliente.id_cliente!
      );
      cliente.enderecos = await EnderecoFacade.getInstance().getByClienteId(
        cliente.id_cliente!
      );
    }
    return clientes;
  }

  async getById(id: number): Promise<Cliente | null> {
    let cliente = await ClienteDAO.getInstance().getById(id);
    if (cliente) {
      cliente.cartoes = await CartaoFacade.getInstance().getByClienteId(id);
      cliente.enderecos = await EnderecoFacade.getInstance().getByClienteId(id);
    }
    return cliente;
  }

  async create(cliente: Cliente): Promise<Cliente> {
    await ClienteDAO.getInstance().create(cliente);
    for (let cartao of cliente.cartoes!) {
      cartao.id_cliente = cliente.id_cliente!;
      await CartaoFacade.getInstance().create(cartao);
    }
    for (let endereco of cliente.enderecos!) {
      endereco.id_cliente = cliente.id_cliente!;
      await EnderecoFacade.getInstance().create(endereco);
    }

    return cliente;
  }

  async update(id: number, cliente: Cliente): Promise<boolean> {
    if (await ClienteDAO.getInstance().update(id, cliente)) {
      for (let cartao of cliente.cartoes!) {
        cartao.id_cliente = id!;
        await CartaoFacade.getInstance().update(cartao.id_cartao!, cartao);
      }
      for (let endereco of cliente.enderecos!) {
        endereco.id_cliente = id!;
        await EnderecoFacade.getInstance().update(
          endereco.id_endereco!,
          endereco
        );
      }
    }
    return true;
  }

  async delete(id: number): Promise<boolean> {
    return await ClienteDAO.getInstance().delete(id);
  }

  async activateOrDeactivate(id: number, ativo: boolean): Promise<boolean> {
    return await ClienteDAO.getInstance().activateOrDeactivate(id, ativo);
  }
}
