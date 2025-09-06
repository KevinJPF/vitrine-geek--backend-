import { Cliente } from "../models/ClienteModel";
import { ClienteDAO } from "../dao/ClienteDAO";
import { IFacade } from "./IFacade";
import CartaoFacade from "./CartaoFacade";
import EnderecoFacade from "./EnderecoFacade";
import { ValidarEmail } from "../strategies/ValidarEmail";
import { ValidarDDD } from "../strategies/ValidarDDD";
import { ValidarData } from "../strategies/ValidarData";
import { ValidarCPF } from "../strategies/ValidarCPF";
import { ValidarTelefone } from "../strategies/ValidarTelefone";
import { ValidarSenha } from "../strategies/ValidarSenha";
import { ValidarGenero } from "../strategies/ValidarGenero";
import { ValidarString } from "../strategies/ValidarString";
import { ValidarTipoTelefone } from "../strategies/ValidarTipoTelefone";

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

  async create(cliente: Cliente): Promise<string> {
    let camposInvalidos: string = "";

    camposInvalidos += (await ValidarString.getInstance().process(
      cliente.nome_cliente
    ))
      ? ""
      : "Nome, ";
    camposInvalidos += (await ValidarGenero.getInstance().process(
      cliente.genero
    ))
      ? ""
      : "Genero, ";
    camposInvalidos += (await ValidarData.getInstance().process(
      cliente.data_nascimento
    ))
      ? ""
      : "Data Nascimento, ";
    camposInvalidos += (await ValidarCPF.getInstance().process(cliente.cpf))
      ? ""
      : "CPF, ";
    camposInvalidos += (await ValidarTipoTelefone.getInstance().process(
      cliente.telefone_tipo
    ))
      ? ""
      : "Tipo Telefone, ";
    camposInvalidos += (await ValidarDDD.getInstance().process(
      cliente.telefone_ddd
    ))
      ? ""
      : "DDD, ";
    camposInvalidos += (await ValidarTelefone.getInstance().process(
      cliente.telefone_numero
    ))
      ? ""
      : "Telefone, ";
    camposInvalidos += (await ValidarEmail.getInstance().process(cliente.email))
      ? ""
      : "Email, ";
    camposInvalidos += (await ValidarSenha.getInstance().process(
      cliente.senha!
    ))
      ? ""
      : "Senha, ";

    if (camposInvalidos) {
      return camposInvalidos.slice(0, -2); // Remove a última vírgula ', '
    }
    // return "sucesso";

    // await ClienteDAO.getInstance().create(cliente);

    for (let cartao of cliente.cartoes!) {
      // cartao.id_cliente = cliente.id_cliente!;
      cartao.id_cliente = 1;
      await CartaoFacade.getInstance().create(cartao);
    }
    // for (let endereco of cliente.enderecos!) {
    //   endereco.id_cliente = cliente.id_cliente!;
    //   await EnderecoFacade.getInstance().create(endereco);
    // }

    return "sucesso";
  }

  async update(id: number, cliente: Cliente): Promise<string> {
    let camposInvalidos: string = "";

    camposInvalidos += await ValidarString.getInstance().process(
      cliente.nome_cliente
    );
    camposInvalidos += await ValidarGenero.getInstance().process(
      cliente.genero
    );
    camposInvalidos += await ValidarData.getInstance().process(
      cliente.data_nascimento
    );
    camposInvalidos += await ValidarCPF.getInstance().process(cliente.cpf);
    camposInvalidos += await ValidarTipoTelefone.getInstance().process(
      cliente.telefone_tipo
    );
    camposInvalidos += await ValidarDDD.getInstance().process(
      cliente.telefone_ddd
    );
    camposInvalidos += await ValidarTelefone.getInstance().process(
      cliente.telefone_numero
    );
    camposInvalidos += await ValidarEmail.getInstance().process(cliente.email);
    camposInvalidos += await ValidarSenha.getInstance().process(cliente.senha!);
    if (camposInvalidos) {
      return camposInvalidos.slice(0, -2); // Remove a última vírgula ', '
    }
    return "sucesso";

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

    return "sucesso";
  }

  async delete(id: number): Promise<boolean> {
    return await ClienteDAO.getInstance().delete(id);
  }

  async activateOrDeactivate(id: number, ativo: boolean): Promise<boolean> {
    return await ClienteDAO.getInstance().activateOrDeactivate(id, ativo);
  }
}
