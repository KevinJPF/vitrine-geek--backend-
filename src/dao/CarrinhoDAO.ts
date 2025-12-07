import { ProdutoCarrinho } from "../models/ProdutoCarrinhoModel";
import { BaseDAO } from "./BaseDAO";
import { ProdutoDAO } from "./ProdutoDAO";

export class CarrinhoDAO extends BaseDAO<ProdutoCarrinho> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: CarrinhoDAO;

  // Construtor privado para evitar instanciamentos
  private constructor() {
    super();
  }

  // Método para obter a instância do singleton
  public static getInstance(): CarrinhoDAO {
    if (!CarrinhoDAO.instance) {
      CarrinhoDAO.instance = new CarrinhoDAO();
    }
    return CarrinhoDAO.instance;
  }
  // #endregion

  // Não utilizado
  async getAll(): Promise<ProdutoCarrinho[]> {
    const [rows] = await this.db.query("SELECT * FROM carrinhos");
    return rows as ProdutoCarrinho[];
  }

  // Não utilizado
  async getById(id: number): Promise<ProdutoCarrinho | null> {
    const [rows] = await this.db.query(
      "SELECT * FROM carrinhos WHERE id_cliente = ?",
      [id]
    );
    const carrinhos = rows as ProdutoCarrinho[];
    return carrinhos.length ? carrinhos[0] : null;
  }

  async create(carrinho: ProdutoCarrinho): Promise<number> {
    console.log("Criando carrinho:", carrinho);
    const [result] = await this.db.query(
      "INSERT INTO carrinhos (id_cliente, produto_id, quantidade, ativo) VALUES (?, ?, ?, ?)",
      [carrinho.id_cliente, carrinho.produto_id, carrinho.quantidade, true]
    );

    return (result as any).insertId;
  }

  async update(id: number, carrinho: ProdutoCarrinho): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE carrinhos SET quantidade = ?, ativo = ? WHERE id_cliente = ? AND produto_id = ?",
      [carrinho.quantidade, carrinho.ativo, id, carrinho.produto_id]
    );

    return (result as any).insertId;
  }

  // Não utilizado
  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.query(
      "DELETE FROM carrinhos WHERE id_carrinho = ?",
      [id]
    );
    return (result as any).affectedRows > 0;
  }

  async getByClienteId(cliente_id: number): Promise<ProdutoCarrinho[]> {
    const [rows] = await this.db.query(
      "SELECT * FROM carrinhos WHERE id_cliente = ?",
      [cliente_id]
    );
    return rows as ProdutoCarrinho[];
  }

  async getByProdutoId(
    cliente_id: number,
    produto_id: number
  ): Promise<ProdutoCarrinho | null> {
    const [rows] = await this.db.query(
      "SELECT * FROM carrinhos WHERE id_cliente = ? AND produto_id = ?",
      [cliente_id, produto_id]
    );
    const carrinhos = rows as ProdutoCarrinho[];
    return carrinhos.length ? carrinhos[0] : null;
  }

  async deleteProdutoCarrinho(
    cliente_id: number,
    produto_id: number
  ): Promise<boolean> {
    const [result] = await this.db.query(
      "DELETE FROM carrinhos WHERE id_cliente = ? AND produto_id = ?",
      [cliente_id, produto_id]
    );
    return (result as any).affectedRows > 0;
  }

  async clearByClienteId(cliente_id: number): Promise<boolean> {
    const [result] = await this.db.query(
      "DELETE FROM carrinhos WHERE id_cliente = ?",
      [cliente_id]
    );
    return (result as any).affectedRows > 0;
  }
}
