import { IStrategy } from "./IStrategy";

export class ValidarDDD implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarDDD;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarDDD {
    if (!ValidarDDD.instance) {
      ValidarDDD.instance = new ValidarDDD();
    }
    return ValidarDDD.instance;
  }
  // #endregion

  private dddValidos: Set<string> = new Set([
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "21",
    "22",
    "24",
    "27",
    "28",
    "31",
    "32",
    "33",
    "34",
    "35",
    "37",
    "38",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "51",
    "53",
    "54",
    "55",
    "61",
    "62",
    "64",
    "65",
    "66",
    "67",
    "71",
    "73",
    "74",
    "75",
    "77",
    "79",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
  ]);

  async process(ddd: string): Promise<boolean> {
    return /^\d{2}$/.test(ddd) && this.dddValidos.has(ddd);
  }
}
