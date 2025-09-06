import { IStrategy } from "./IStrategy";

export class ValidarTelefone implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarTelefone;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarTelefone {
    if (!ValidarTelefone.instance) {
      ValidarTelefone.instance = new ValidarTelefone();
    }
    return ValidarTelefone.instance;
  }
  // #endregion

  async process(telefone: string): Promise<boolean> {
    return /^\d{8,9}$/.test(telefone.replace(/\D/g, ""));
  }
}
