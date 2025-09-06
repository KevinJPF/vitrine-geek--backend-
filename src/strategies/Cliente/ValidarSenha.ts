import { IStrategy } from "../IStrategy";

export class ValidarSenha implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarSenha;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarSenha {
    if (!ValidarSenha.instance) {
      ValidarSenha.instance = new ValidarSenha();
    }
    return ValidarSenha.instance;
  }
  // #endregion

  async process(senha: string): Promise<boolean> {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

    return regex.test(senha);
  }
}
