import { IStrategy } from "./IStrategy";

export class ValidarString implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarString;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarString {
    if (!ValidarString.instance) {
      ValidarString.instance = new ValidarString();
    }
    return ValidarString.instance;
  }
  // #endregion

  async process(valor: string): Promise<boolean> {
    return valor.trim() !== "";
  }
}
