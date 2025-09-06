import { IStrategy } from "../IStrategy";

export class ValidarNumeroCartao implements IStrategy<string> {
  private VALIDATEONLYNUMBERS: boolean = true;
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarNumeroCartao;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarNumeroCartao {
    if (!ValidarNumeroCartao.instance) {
      ValidarNumeroCartao.instance = new ValidarNumeroCartao();
    }
    return ValidarNumeroCartao.instance;
  }
  // #endregion

  async process(numero: string): Promise<boolean> {
    const digits = numero.replace(/\D/g, "");

    if (this.VALIDATEONLYNUMBERS && digits.length == 16) return true;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }
}
