import { IStrategy } from "../IStrategy";

export class ValidarGenero implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarGenero;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarGenero {
    if (!ValidarGenero.instance) {
      ValidarGenero.instance = new ValidarGenero();
    }
    return ValidarGenero.instance;
  }
  // #endregion

  async process(genero: string): Promise<boolean> {
    const generosValidos = ["masculino", "feminino", "outro"];
    return generosValidos.includes(genero.toLowerCase());
  }
}
