import { Endereco } from "../models/EnderecoModel";
import { BaseDAO } from "./BaseDAO";

export class EnderecoDAO extends BaseDAO<Endereco> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: EnderecoDAO;

  // Construtor privado para evitar instanciamentos
  private constructor() {
    super();
  }

  // Método para obter a instância do singleton
  public static getInstance(): EnderecoDAO {
    if (!EnderecoDAO.instance) {
      EnderecoDAO.instance = new EnderecoDAO();
    }
    return EnderecoDAO.instance;
  }
  // #endregion

  async getAll(): Promise<Endereco[]> {
    const [rows] = await this.db.query("SELECT * FROM enderecos");
    return rows as Endereco[];
  }

  async getById(id: number): Promise<Endereco | null> {
    const [rows] = await this.db.query(
      "SELECT E.*, CE.* FROM enderecos E JOIN clientes_enderecos CE ON E.id_endereco = CE.id_endereco WHERE CE.id_cliente = ?",
      [id]
    );
    const enderecos = rows as Endereco[];
    return enderecos.length ? enderecos[0] : null;
  }

  async create(endereco: Endereco): Promise<Endereco> {
    const [result] = await this.db.query(
      "INSERT INTO enderecos (logradouro, numero, bairro, cep, cidade, estado, pais) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        endereco.logradouro,
        endereco.numero,
        endereco.bairro,
        endereco.cep,
        endereco.cidade,
        endereco.estado,
        endereco.pais,
      ]
    );
    endereco.id_endereco = (result as any).insertId;

    // Vincula o endereço ao cliente na tabela relacional
    await this.linkToCliente(endereco);

    return endereco;
  }

  async update(id: number, endereco: Endereco): Promise<boolean> {
    let [result] = await this.db.query(
      "UPDATE enderecos SET logradouro = ?, numero = ?, bairro = ?, cep = ?, cidade = ?, estado = ?, pais = ? WHERE id_endereco = ?",
      [
        endereco.logradouro,
        endereco.numero,
        endereco.bairro,
        endereco.cep,
        endereco.cidade,
        endereco.estado,
        endereco.pais,
        id,
      ]
    );
    [result] = await this.db.query(
      "UPDATE clientes_enderecos SET nome_endereco = ?, tipo_residencia = ?, tipo_logradouro = ?, obs_endereco = ?, endereco_entrega = ?, endereco_cobranca = ?, favorito = ? WHERE id_cliente = ? AND id_endereco = ?",
      [
        endereco.nome_endereco,
        endereco.tipo_residencia,
        endereco.tipo_logradouro,
        endereco.obs_endereco,
        endereco.endereco_entrega,
        endereco.endereco_cobranca,
        endereco.favorito,
        endereco.id_cliente,
        id,
      ]
    );
    return (result as any).affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.query(
      "DELETE FROM enderecos WHERE id_endereco = ?",
      [id]
    );
    return (result as any).affectedRows > 0;
  }

  async getByClienteId(clienteId: number): Promise<Endereco[]> {
    const [rows] = await this.db.query(
      "SELECT E.*, CE.* FROM enderecos E JOIN clientes_enderecos CE ON E.id_endereco = CE.id_endereco WHERE CE.id_cliente = ?",
      [clienteId]
    );
    return rows as Endereco[];
  }

  private async linkToCliente(endereco: Endereco): Promise<void> {
    await this.db.query(
      "INSERT INTO clientes_enderecos (id_cliente, id_endereco, nome_endereco, tipo_residencia, tipo_logradouro, obs_endereco, endereco_entrega, endereco_cobranca, favorito) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        endereco.id_cliente,
        endereco.id_endereco,
        endereco.nome_endereco,
        endereco.tipo_residencia,
        endereco.tipo_logradouro,
        endereco.obs_endereco,
        endereco.endereco_entrega,
        endereco.endereco_cobranca,
        endereco.favorito,
      ]
    );
  }
}
