import { IStrategy } from "./IStrategy";

export class ValidarData implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarData;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarData {
    if (!ValidarData.instance) {
      ValidarData.instance = new ValidarData();
    }
    return ValidarData.instance;
  }
  // #endregion

  async process(data: string): Promise<boolean> {
    // Lógica de validação de data
    return /^\d{2}\/\d{2}\/\d{4}$/.test(data);
  }
}
