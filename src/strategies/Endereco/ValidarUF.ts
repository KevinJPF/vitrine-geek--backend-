import { IStrategy } from "../IStrategy";

export class ValidarUF implements IStrategy<string> {
  private ufValidos: Set<string> = new Set([
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ]);

  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarUF;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarUF {
    if (!ValidarUF.instance) {
      ValidarUF.instance = new ValidarUF();
    }
    return ValidarUF.instance;
  }
  // #endregion

  async process(valor: string): Promise<boolean> {
    return this.ufValidos.has(valor.toUpperCase());
  }
}
