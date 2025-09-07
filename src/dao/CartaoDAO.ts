import { Cartao } from "../models/CartaoModel";
import { BaseDAO } from "./BaseDAO";

export class CartaoDAO extends BaseDAO<Cartao> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: CartaoDAO;

  // Construtor privado para evitar instanciamentos
  private constructor() {
    super();
  }

  // Método para obter a instância do singleton
  public static getInstance(): CartaoDAO {
    if (!CartaoDAO.instance) {
      CartaoDAO.instance = new CartaoDAO();
    }
    return CartaoDAO.instance;
  }
  // #endregion

  async getAll(): Promise<Cartao[]> {
    const [rows] = await this.db.query(
      "SELECT C.*, B.nome_bandeira FROM cartoes_credito C JOIN bandeiras B ON C.id_bandeira = B.id_bandeira"
    );
    return rows as Cartao[];
  }

  async getById(id: number): Promise<Cartao | null> {
    const [rows] = await this.db.query(
      "SELECT * FROM cartoes_credito WHERE id_cartao = ?",
      [id]
    );
    const cartoes_credito = rows as Cartao[];
    return cartoes_credito.length ? cartoes_credito[0] : null;
  }

  async create(cartao: Cartao): Promise<number> {
    const [result] = await this.db.query(
      "INSERT INTO cartoes_credito (nome_cartao, numero_cartao, nome_impresso, id_bandeira, codigo_seguranca, favorito, id_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        cartao.nome_cartao,
        cartao.numero_cartao,
        cartao.nome_impresso,
        cartao.id_bandeira,
        cartao.codigo_seguranca,
        cartao.favorito,
        cartao.id_cliente,
      ]
    );

    return (result as any).insertId;
  }

  async update(id: number, cartao: Cartao): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE cartoes_credito SET nome_cartao = ?, numero_cartao = ?, nome_impresso = ?, id_bandeira = ?, codigo_seguranca = ?, favorito = ? WHERE id_cartao = ?",
      [
        cartao.nome_cartao,
        cartao.numero_cartao,
        cartao.nome_impresso,
        cartao.id_bandeira,
        cartao.codigo_seguranca,
        cartao.favorito,
        id,
      ]
    );
    return (result as any).affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.query(
      "DELETE FROM cartoes_credito WHERE id_cartao = ?",
      [id]
    );
    return (result as any).affectedRows > 0;
  }

  async getByClienteId(clienteId: number): Promise<Cartao[]> {
    const [rows] = await this.db.query(
      "SELECT C.*, B.nome_bandeira FROM cartoes_credito C JOIN bandeiras B ON C.id_bandeira = B.id_bandeira WHERE id_cliente = ?",
      [clienteId]
    );
    return rows as Cartao[];
  }

  async getBandeiras(): Promise<any[]> {
    const [rows]: any[] = await this.db.query("SELECT * FROM bandeiras");
    return rows;
  }

  async getBandeiraById(id: number): Promise<any[]> {
    const [rows]: any[] = await this.db.query(
      "SELECT * FROM bandeiras WHERE id_bandeira = ?",
      [id]
    );
    return rows;
  }
}
