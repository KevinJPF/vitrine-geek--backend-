import { ClienteDAO } from "../../dao/ClienteDAO";
import { IStrategy } from "../IStrategy";

export class ValidarCPF implements IStrategy<string> {
  private VALIDATEONLYNUMBERS: boolean = true;
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarCPF;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarCPF {
    if (!ValidarCPF.instance) {
      ValidarCPF.instance = new ValidarCPF();
    }
    return ValidarCPF.instance;
  }
  // #endregion

  async process(cpf: string, id?: number): Promise<boolean> {
    let cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11 || /^(\d)\1+$/.test(cpfLimpo)) return false;

    if (await ClienteDAO.getInstance().getByCPF(cpf, id)) return false;

    if (this.VALIDATEONLYNUMBERS) return true;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;
    if (firstDigit !== parseInt(cpfLimpo.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;
    return secondDigit === parseInt(cpfLimpo.charAt(10));
  }
}
