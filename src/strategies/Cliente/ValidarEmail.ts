import { IStrategy } from "../IStrategy";

export class ValidarEmail implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarEmail;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarEmail {
    if (!ValidarEmail.instance) {
      ValidarEmail.instance = new ValidarEmail();
    }
    return ValidarEmail.instance;
  }
  // #endregion

  async process(email: string): Promise<boolean> {
    // Lógica de validação de email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
