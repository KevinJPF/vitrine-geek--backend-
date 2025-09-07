import bcrypt from "bcrypt";

export class Criptografia {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: Criptografia;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): Criptografia {
    if (!Criptografia.instance) {
      Criptografia.instance = new Criptografia();
    }
    return Criptografia.instance;
  }
  // #endregion

  async hash(senha: string): Promise<string> {
    return bcrypt.hash(senha, 10);
  }

  async compare(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
  }
}
