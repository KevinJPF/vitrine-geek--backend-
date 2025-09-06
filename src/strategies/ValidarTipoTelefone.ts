import { IStrategy } from "./IStrategy";

export class ValidarTipoTelefone implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarTipoTelefone;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarTipoTelefone {
    if (!ValidarTipoTelefone.instance) {
      ValidarTipoTelefone.instance = new ValidarTipoTelefone();
    }
    return ValidarTipoTelefone.instance;
  }
  // #endregion

  async process(valor: string): Promise<boolean> {
    return valor.trim() === "";
  }
}
