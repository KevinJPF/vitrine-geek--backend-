import { IStrategy } from "../IStrategy";

export class ValidarCodSeguranca implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarCodSeguranca;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarCodSeguranca {
    if (!ValidarCodSeguranca.instance) {
      ValidarCodSeguranca.instance = new ValidarCodSeguranca();
    }
    return ValidarCodSeguranca.instance;
  }
  // #endregion

  async process(data: string): Promise<boolean> {
    // Lógica de validação de código de segurança
    return /^\d{3}$/.test(data);
  }
}
