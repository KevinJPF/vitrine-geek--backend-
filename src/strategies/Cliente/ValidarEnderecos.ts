import { IStrategy } from "../IStrategy";

export class ValidarEnderecos implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarEnderecos;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarEnderecos {
    if (!ValidarEnderecos.instance) {
      ValidarEnderecos.instance = new ValidarEnderecos();
    }
    return ValidarEnderecos.instance;
  }
  // #endregion

  async process(enderecos: any[]): Promise<boolean> {
    const enderecosCobrancaCount = enderecos.filter(
      (endereco) => endereco.endereco_cobranca
    ).length;

    const enderecosEntregaCount = enderecos.filter(
      (endereco) => endereco.endereco_entrega
    ).length;

    return enderecosCobrancaCount >= 1 && enderecosEntregaCount >= 1;
  }
}
