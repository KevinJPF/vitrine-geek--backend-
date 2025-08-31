import { Cliente } from "../models/ClienteModel";
import { BaseDAO } from "./BaseDAO";

export class ClienteDAO extends BaseDAO<Cliente> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ClienteDAO;

  // Construtor privado para evitar instanciamentos
  private constructor() {
    super();
  }

  // Método para obter a instância do singleton
  public static getInstance(): ClienteDAO {
    if (!ClienteDAO.instance) {
      ClienteDAO.instance = new ClienteDAO();
    }
    return ClienteDAO.instance;
  }
  // #endregion

  async getAll(): Promise<Cliente[]> {
    const [rows] = await this.db.query("SELECT * FROM clientes");
    return rows as Cliente[];
  }

  async getById(id: number): Promise<Cliente | null> {
    const [rows] = await this.db.query(
      "SELECT * FROM clientes WHERE id_cliente = ?",
      [id]
    );
    const clientes = rows as Cliente[];
    return clientes.length ? clientes[0] : null;
  }

  async create(user: Cliente): Promise<Cliente> {
    const [result] = await this.db.query(
      "INSERT INTO clientes (name, email) VALUES (?, ?)",
      [user.name, user.email]
    );
    const insertId = (result as any).insertId;
    return { id: insertId, ...user };
  }

  async update(id: number, user: Cliente): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE clientes SET name = ?, email = ? WHERE id = ?",
      [user.name, user.email, id]
    );
    return (result as any).affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.query("DELETE FROM clientes WHERE id = ?", [
      id,
    ]);
    return (result as any).affectedRows > 0;
  }
}
