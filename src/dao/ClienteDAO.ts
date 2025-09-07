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

  async create(cliente: Cliente): Promise<number> {
    const [result] = await this.db.query(
      "INSERT INTO clientes (genero, nome_cliente, data_nascimento, cpf, telefone_tipo, telefone_ddd, telefone_numero, email, senha, ranking, cliente_ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        cliente.genero,
        cliente.nome_cliente,
        cliente.data_nascimento,
        cliente.cpf,
        cliente.telefone_tipo,
        cliente.telefone_ddd,
        cliente.telefone_numero,
        cliente.email,
        cliente.senha,
        cliente.ranking,
        cliente.cliente_ativo,
      ]
    );

    return (result as any).insertId;
  }

  async update(id: number, cliente: Cliente): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE clientes SET genero = ?, nome_cliente = ?, data_nascimento = ?, cpf = ?, telefone_tipo = ?, telefone_ddd = ?, telefone_numero = ?, email = ?, senha = ?, ranking = ?, cliente_ativo = ? WHERE id_cliente = ?",
      [
        cliente.genero,
        cliente.nome_cliente,
        cliente.data_nascimento,
        cliente.cpf,
        cliente.telefone_tipo,
        cliente.telefone_ddd,
        cliente.telefone_numero,
        cliente.email,
        cliente.senha,
        cliente.ranking,
        cliente.cliente_ativo,
        id,
      ]
    );
    return (result as any).affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.query(
      "DELETE FROM clientes WHERE id_cliente = ?",
      [id]
    );
    return (result as any).affectedRows > 0;
  }

  async getByCPF(cpf: string): Promise<Cliente | null> {
    const [rows] = await this.db.query("SELECT * FROM clientes WHERE cpf = ?", [
      cpf,
    ]);
    const clientes = rows as Cliente[];
    return clientes.length ? clientes[0] : null;
  }

  async changePassword(id: number, senha: string): Promise<string> {
    const sql = "UPDATE clientes SET senha = ? WHERE id_cliente = ?";

    const [result] = await this.db.query(sql, [senha, id]);
    return (result as any).affectedRows > 0 ? "sucesso" : "erro";
  }

  async activateOrDeactivate(id: number, ativo: boolean): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE clientes SET cliente_ativo = ? WHERE id_cliente = ?",
      [ativo, id]
    );
    return (result as any).affectedRows > 0;
  }
}
