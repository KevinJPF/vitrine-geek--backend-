import { IStrategy } from "../IStrategy";

export class ValidarCEP implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarCEP;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarCEP {
    if (!ValidarCEP.instance) {
      ValidarCEP.instance = new ValidarCEP();
    }
    return ValidarCEP.instance;
  }
  // #endregion

  async process(cep: string): Promise<boolean> {
    // CEP (apenas dígitos, 8 caracteres)
    return /^\d{8}$/.test(cep.replace(/\D/g, ""));
  }
}
