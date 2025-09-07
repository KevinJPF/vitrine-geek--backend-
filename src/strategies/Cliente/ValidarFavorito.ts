import { IStrategy } from "../IStrategy";

export class ValidarFavorito implements IStrategy<string> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ValidarFavorito;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): ValidarFavorito {
    if (!ValidarFavorito.instance) {
      ValidarFavorito.instance = new ValidarFavorito();
    }
    return ValidarFavorito.instance;
  }
  // #endregion

  async process(entities: any[]): Promise<boolean> {
    const favoritoCount = entities.filter((entity) => entity.favorito).length;
    return favoritoCount <= 1;
  }
}
