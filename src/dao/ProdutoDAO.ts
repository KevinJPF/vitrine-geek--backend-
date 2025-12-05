import { Produto } from "../models/ProdutoModel";
import { BaseDAO } from "./BaseDAO";

export class ProdutoDAO extends BaseDAO<Produto> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: ProdutoDAO;

  // Construtor privado para evitar instanciamentos
  private constructor() {
    super();
  }

  // Método para obter a instância do singleton
  public static getInstance(): ProdutoDAO {
    if (!ProdutoDAO.instance) {
      ProdutoDAO.instance = new ProdutoDAO();
    }
    return ProdutoDAO.instance;
  }
  // #endregion

  async getAll(): Promise<Produto[]> {
    const [rows] = await this.db.query(
      "SELECT P.*, I.url_imagem, I.ordem, I.principal FROM produtos P LEFT JOIN produtos_imagens I ON P.id = I.produto_id"
    );
    return rows as Produto[];
  }

  async getById(id: number): Promise<Produto | null> {
    const [rows] = await this.db.query(
      "SELECT P.*, I.* FROM produtos P LEFT JOIN produtos_imagens I ON P.id = I.produto_id WHERE P.id = ?",
      [id]
    );
    const produtos = rows as Produto[];
    return produtos.length ? produtos[0] : null;
  }

  async create(produto: Produto): Promise<number> {
    const [result] = await this.db.query(
      "INSERT INTO produtos (nome_produto, preco_produto) VALUES (?, ?)",
      [produto.nome_produto, produto.valor_venda]
    );

    return (result as any).insertId;
  }

  async update(id: number, produto: Produto): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE produtos SET nome_produto = ?, preco_produto = ? WHERE id = ?",
      [produto.nome_produto, produto.valor_venda, id]
    );

    return (result as any).insertId;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.query("DELETE FROM produtos WHERE id = ?", [
      id,
    ]);
    return (result as any).affectedRows > 0;
  }

  async getProdutosByPedidoId(pedidoId: number): Promise<Produto[]> {
    const [rows] = await this.db.query(
      "SELECT P.*, I.*, Pe.* FROM produtos P LEFT JOIN produtos_imagens I ON P.id = I.produto_id INNER JOIN pedidos_itens Pe ON P.id = Pe.produto_id WHERE Pe.pedido_id = ?",
      [pedidoId]
    );
    return rows as Produto[];
  }

  async getCategorias(): Promise<any[]> {
    const [rows] = await this.db.query("SELECT * FROM categorias");
    return rows as any[];
  }
}
