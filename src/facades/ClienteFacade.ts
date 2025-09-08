// Model
import { Cliente } from "../models/ClienteModel";

// DAO
import { ClienteDAO } from "../dao/ClienteDAO";

// Facades
import { IFacade } from "./IFacade";
import CartaoFacade from "./CartaoFacade";
import EnderecoFacade from "./EnderecoFacade";

// Strategies
import { ValidarEmail } from "../strategies/Cliente/ValidarEmail";
import { ValidarDDD } from "../strategies/Cliente/ValidarDDD";
import { ValidarCPF } from "../strategies/Cliente/ValidarCPF";
import { ValidarTelefone } from "../strategies/Cliente/ValidarTelefone";
import { ValidarSenha } from "../strategies/Cliente/ValidarSenha";
import { ValidarGenero } from "../strategies/Cliente/ValidarGenero";
import { ValidarData } from "../strategies/ValidarData";
import { ValidarString } from "../strategies/ValidarString";
import { ValidarFavorito } from "../strategies/Cliente/ValidarFavorito";
import { ValidarEnderecos } from "../strategies/Cliente/ValidarEnderecos";
import { Criptografia } from "../strategies/Criptografia";

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

  async create(cliente: Cliente): Promise<{ [key: string]: any }> {
    let camposInvalidos: {
      cliente: string;
      cartoes: [{}?];
      enderecos: [{}?];
    } = {
      cliente: "",
      cartoes: [],
      enderecos: [],
    };

    camposInvalidos.cliente += (await ValidarString.getInstance().process(
      cliente.nome_cliente
    ))
      ? ""
      : "Nome, ";
    camposInvalidos.cliente += (await ValidarGenero.getInstance().process(
      cliente.genero
    ))
      ? ""
      : "Genero, ";
    camposInvalidos.cliente += (await ValidarData.getInstance().process(
      cliente.data_nascimento
    ))
      ? ""
      : "Data Nascimento, ";
    camposInvalidos.cliente += (await ValidarCPF.getInstance().process(
      cliente.cpf
    ))
      ? ""
      : "CPF, ";
    camposInvalidos.cliente += (await ValidarString.getInstance().process(
      cliente.telefone_tipo
    ))
      ? ""
      : "Tipo Telefone, ";
    camposInvalidos.cliente += (await ValidarDDD.getInstance().process(
      cliente.telefone_ddd
    ))
      ? ""
      : "DDD, ";
    camposInvalidos.cliente += (await ValidarTelefone.getInstance().process(
      cliente.telefone_numero
    ))
      ? ""
      : "Telefone, ";
    camposInvalidos.cliente += (await ValidarEmail.getInstance().process(
      cliente.email
    ))
      ? ""
      : "Email, ";
    camposInvalidos.cliente += (await ValidarSenha.getInstance().process(
      cliente.senha!
    ))
      ? ""
      : "Senha, ";
    camposInvalidos.cliente += (await ValidarFavorito.getInstance().process(
      cliente.cartoes!
    ))
      ? ""
      : "Mais de um cartao favorito, ";
    camposInvalidos.cliente += (await ValidarFavorito.getInstance().process(
      cliente.enderecos!
    ))
      ? ""
      : "Mais de um endereco favorito, ";
    camposInvalidos.cliente += (await ValidarEnderecos.getInstance().process(
      cliente.enderecos!
    ))
      ? ""
      : "Obrigatorio ao menos um endereco de entrega e cobranca, ";

    if (camposInvalidos.cliente) {
      camposInvalidos.cliente = camposInvalidos.cliente.slice(0, -2); // Remove a última vírgula ', '
      return camposInvalidos;
    } else {
      cliente.senha = await Criptografia.getInstance().hash(cliente.senha!);
    }

    const clienteId = await ClienteDAO.getInstance().create(cliente);

    for (let i = 0; i < cliente.cartoes!.length; i++) {
      const cartao = cliente.cartoes![i];
      cartao.id_cliente = clienteId;

      const camposInvalidosCartao = await CartaoFacade.getInstance().create(
        cartao
      );

      if (camposInvalidosCartao.campos_invalidos) {
        const key = `cartao_${i}`;
        camposInvalidos.cartoes[i] = {
          [key]: camposInvalidosCartao.campos_invalidos,
        };
      }
    }

    for (let i = 0; i < cliente.enderecos!.length; i++) {
      const endereco = cliente.enderecos![i];
      endereco.id_cliente = clienteId;

      const camposInvalidosEndereco = await EnderecoFacade.getInstance().create(
        endereco
      );

      if (camposInvalidosEndereco.campos_invalidos) {
        const key = `endereco_${i}`;
        camposInvalidos.enderecos[i] = {
          [key]: camposInvalidosEndereco.campos_invalidos,
        };
      }
    }

    if (
      camposInvalidos.cliente !== "" ||
      camposInvalidos.cartoes.length > 0 ||
      camposInvalidos.enderecos.length > 0
    ) {
      ClienteDAO.getInstance().delete(clienteId);
      return camposInvalidos;
    }

    return {};
  }

  async update(
    id: number,
    cliente: Cliente,
    clienteAtual: Cliente
  ): Promise<{ [key: string]: any }> {
    let camposInvalidos: {
      cliente: string;
      cartoes: [{}?];
      enderecos: [{}?];
    } = {
      cliente: "",
      cartoes: [],
      enderecos: [],
    };

    camposInvalidos.cliente += (await ValidarString.getInstance().process(
      cliente.nome_cliente
    ))
      ? ""
      : "Nome, ";
    camposInvalidos.cliente += (await ValidarGenero.getInstance().process(
      cliente.genero
    ))
      ? ""
      : "Genero, ";
    camposInvalidos.cliente += (await ValidarData.getInstance().process(
      cliente.data_nascimento
    ))
      ? ""
      : "Data Nascimento, ";
    camposInvalidos.cliente += (await ValidarCPF.getInstance().process(
      cliente.cpf,
      id
    ))
      ? ""
      : "CPF, ";
    camposInvalidos.cliente += (await ValidarString.getInstance().process(
      cliente.telefone_tipo
    ))
      ? ""
      : "Tipo Telefone, ";
    camposInvalidos.cliente += (await ValidarDDD.getInstance().process(
      cliente.telefone_ddd
    ))
      ? ""
      : "DDD, ";
    camposInvalidos.cliente += (await ValidarTelefone.getInstance().process(
      cliente.telefone_numero
    ))
      ? ""
      : "Telefone, ";
    camposInvalidos.cliente += (await ValidarEmail.getInstance().process(
      cliente.email,
      id
    ))
      ? ""
      : "Email, ";
    camposInvalidos.cliente += (await ValidarSenha.getInstance().process(
      cliente.senha!
    ))
      ? ""
      : "Senha, ";
    camposInvalidos.cliente += (await ValidarFavorito.getInstance().process(
      cliente.cartoes!
    ))
      ? ""
      : "Mais de um cartao favorito, ";
    camposInvalidos.cliente += (await ValidarFavorito.getInstance().process(
      cliente.enderecos!
    ))
      ? ""
      : "Mais de um endereco favorito, ";
    camposInvalidos.cliente += (await ValidarEnderecos.getInstance().process(
      cliente.enderecos!
    ))
      ? ""
      : "Obrigatorio ao menos um endereco de entrega e cobranca, ";

    if (camposInvalidos.cliente) {
      camposInvalidos.cliente = camposInvalidos.cliente.slice(0, -2); // Remove a última vírgula ', '
      return camposInvalidos;
    } else {
      cliente.senha = await Criptografia.getInstance().hash(cliente.senha!);
    }

    if (await ClienteDAO.getInstance().update(id, cliente)) {
      for (let i = 0; i < cliente.cartoes!.length; i++) {
        const cartao = cliente.cartoes![i];
        cartao.id_cliente = id!;
        let camposInvalidosCartao: { [key: string]: any } = {};

        if (
          cartao.id_cartao &&
          clienteAtual.cartoes?.some(
            (cartaoAtual) => cartaoAtual.id_cartao == cartao.id_cartao
          )
        ) {
          camposInvalidosCartao = await CartaoFacade.getInstance().update(
            cartao.id_cartao!,
            cartao
          );
        } else {
          camposInvalidosCartao = await CartaoFacade.getInstance().create(
            cartao
          );
        }

        if (camposInvalidosCartao.campos_invalidos) {
          const key = `cartao_${i}`;
          camposInvalidos.cartoes[i] = {
            [key]: camposInvalidosCartao.campos_invalidos,
          };
        }
      }

      for (let i = 0; i < cliente.enderecos!.length; i++) {
        const endereco = cliente.enderecos![i];
        endereco.id_cliente = id!;
        let camposInvalidosEndereco: { [key: string]: any } = {};

        if (
          endereco.id_endereco &&
          clienteAtual.enderecos?.some(
            (enderecoAtual) => enderecoAtual.id_endereco == endereco.id_endereco
          )
        ) {
          camposInvalidosEndereco = await EnderecoFacade.getInstance().update(
            endereco.id_endereco!,
            endereco
          );
        } else {
          camposInvalidosEndereco = await EnderecoFacade.getInstance().create(
            endereco
          );
        }

        if (camposInvalidosEndereco.campos_invalidos) {
          const key = `endereco_${i}`;
          camposInvalidos.enderecos[i] = {
            [key]: camposInvalidosEndereco.campos_invalidos,
          };
        }
      }

      const cartoesParaExcluir = clienteAtual.cartoes!.filter(
        (cartaoAtual) =>
          !cliente.cartoes!.some(
            (cartaoNovo) => cartaoNovo.id_cartao == cartaoAtual.id_cartao
          )
      );

      for (let cartaoParaExcluir of cartoesParaExcluir) {
        await CartaoFacade.getInstance().delete(cartaoParaExcluir.id_cartao!);
      }

      const enderecosParaExcluir = clienteAtual.enderecos!.filter(
        (enderecoAtual) =>
          !cliente.enderecos!.some(
            (enderecoNovo) =>
              enderecoNovo.id_endereco == enderecoAtual.id_endereco
          )
      );

      for (let enderecoParaExcluir of enderecosParaExcluir) {
        await EnderecoFacade.getInstance().delete(
          enderecoParaExcluir.id_endereco!
        );
      }
    }

    if (
      camposInvalidos.cliente !== "" ||
      camposInvalidos.cartoes.length > 0 ||
      camposInvalidos.enderecos.length > 0
    ) {
      return camposInvalidos;
    }

    return {};
  }

  async delete(id: number): Promise<boolean> {
    return await ClienteDAO.getInstance().delete(id);
  }

  async activateOrDeactivate(id: number, ativo: boolean): Promise<boolean> {
    return await ClienteDAO.getInstance().activateOrDeactivate(id, ativo);
  }

  async changePassword(id: number, senha: string): Promise<string> {
    const clienteExistente = await ClienteDAO.getInstance().getById(id);
    if (!clienteExistente) {
      return "Cliente não encontrado";
    }

    const resultado = await ClienteDAO.getInstance().changePassword(id, senha);

    if (resultado) {
      return "Senha alterada com sucesso";
    }

    return "Erro ao alterar senha";
  }
}
