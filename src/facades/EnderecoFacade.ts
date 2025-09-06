import { Endereco } from "../models/EnderecoModel";
import { EnderecoDAO } from "../dao/EnderecoDAO";
import { IFacade } from "./IFacade";
import { ValidarString } from "../strategies/ValidarString";
import { ValidarCEP } from "../strategies/Endereco/ValidarCEP";
import { ValidarUF } from "../strategies/Endereco/ValidarUF";

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

  async create(endereco: Endereco): Promise<string> {
    let camposInvalidos: string = "";

    camposInvalidos += (await ValidarString.getInstance().process(
      endereco.nome_endereco
    ))
      ? ""
      : "Nome do Endereco, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      endereco.tipo_residencia
    ))
      ? ""
      : "Tipo de Residencia, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      endereco.tipo_logradouro
    ))
      ? ""
      : "Tipo de Logradouro, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      endereco.logradouro
    ))
      ? ""
      : "Logradouro, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      endereco.numero
    ))
      ? ""
      : "Numero, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      endereco.bairro
    ))
      ? ""
      : "Bairro, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      endereco.cidade
    ))
      ? ""
      : "Cidade, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      endereco.pais
    ))
      ? ""
      : "Pais, ";
    camposInvalidos += (await ValidarCEP.getInstance().process(endereco.cep))
      ? ""
      : "CEP, ";
    camposInvalidos += (await ValidarUF.getInstance().process(endereco.estado))
      ? ""
      : "Estado, ";

    if (camposInvalidos) {
      return camposInvalidos.slice(0, -2); // Remove a última vírgula ', '
    }
    return "";

    return (await EnderecoDAO.getInstance().create(endereco)) ? "" : "erro";
  }

  async update(id: number, endereco: Endereco): Promise<string> {
    return (await EnderecoDAO.getInstance().update(id, endereco)) ? "" : "erro";
  }

  async delete(id: number): Promise<boolean> {
    return await EnderecoDAO.getInstance().delete(id);
  }

  async getByClienteId(clienteId: number): Promise<Endereco[]> {
    return await EnderecoDAO.getInstance().getByClienteId(clienteId);
  }
}
