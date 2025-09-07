import { Cartao } from "../models/CartaoModel";
import { ValidarCodSeguranca } from "../strategies/Cartao/ValidarCodSeguranca";
import { ValidarNumeroCartao } from "../strategies/Cartao/ValidarNumeroCartao";
import { ValidarString } from "../strategies/ValidarString";
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

  async create(cartao: Cartao): Promise<{ [key: string]: any }> {
    let camposInvalidos: string = "";

    camposInvalidos += (await ValidarString.getInstance().process(
      cartao.nome_cartao
    ))
      ? ""
      : "Nome do Cartao, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      cartao.nome_impresso
    ))
      ? ""
      : "Nome Impresso, ";
    camposInvalidos += (await ValidarNumeroCartao.getInstance().process(
      cartao.numero_cartao
    ))
      ? ""
      : "Numero do Cartao, ";
    camposInvalidos += (await ValidarCodSeguranca.getInstance().process(
      cartao.codigo_seguranca
    ))
      ? ""
      : "Codigo de Seguranca, ";
    camposInvalidos +=
      (await CartaoDAO.getInstance().getBandeiraById(cartao.id_bandeira))
        .length > 0
        ? ""
        : "Bandeira do Cartao, ";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) }; // Remove a última vírgula ', '
    }
    // return {};

    return (await CartaoDAO.getInstance().create(cartao))
      ? {}
      : { status: "erro" };
  }

  async update(id: number, cartao: Cartao): Promise<{ [key: string]: any }> {
    let camposInvalidos: string = "";

    camposInvalidos += id ? "" : "ID do Cartao, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      cartao.nome_cartao
    ))
      ? ""
      : "Nome do Cartao, ";
    camposInvalidos += (await ValidarString.getInstance().process(
      cartao.nome_impresso
    ))
      ? ""
      : "Nome Impresso, ";
    camposInvalidos += (await ValidarNumeroCartao.getInstance().process(
      cartao.numero_cartao
    ))
      ? ""
      : "Numero do Cartao, ";
    camposInvalidos += (await ValidarCodSeguranca.getInstance().process(
      cartao.codigo_seguranca
    ))
      ? ""
      : "Codigo de Seguranca, ";
    camposInvalidos +=
      (await CartaoDAO.getInstance().getBandeiraById(cartao.id_bandeira))
        .length > 0
        ? ""
        : "Bandeira do Cartao, ";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) }; // Remove a última vírgula ', '
    }
    // return {};

    return (await CartaoDAO.getInstance().update(id, cartao))
      ? {}
      : { status: "erro" };
  }

  async delete(id: number): Promise<boolean> {
    return await CartaoDAO.getInstance().delete(id);
  }

  async getByClienteId(clienteId: number): Promise<Cartao[]> {
    return await CartaoDAO.getInstance().getByClienteId(clienteId);
  }

  async getBandeiras(): Promise<Cartao[]> {
    return await CartaoDAO.getInstance().getBandeiras();
  }
}
