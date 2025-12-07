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
      "SELECT P.*, E.quantidade_disponivel FROM produtos P LEFT JOIN estoque E ON P.id = E.produto_id"
    );
    return rows as Produto[];
  }

  async getById(id: number): Promise<Produto | null> {
    const [rows] = await this.db.query(
      "SELECT P.*, E.quantidade_disponivel FROM produtos P LEFT JOIN estoque E ON P.id = E.produto_id WHERE P.id = ?",
      [id]
    );
    const produtos = rows as Produto[];
    return produtos.length ? produtos[0] : null;
  }

  async create(produto: Produto): Promise<number> {
    const [result] = await this.db.query(
      `INSERT INTO produtos (codigo,
        nome_produto,
        fabricante_id,
        ano_lancamento,
        descricao,
        codigo_barras,
        altura,
        largura,
        profundidade,
        peso,
        grupo_precificacao_id,
        valor_venda,
        ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        produto.codigo,
        produto.nome_produto,
        produto.fabricante_id,
        produto.ano_lancamento,
        produto.descricao,
        produto.codigo_barras,
        produto.altura,
        produto.largura,
        produto.profundidade,
        produto.peso,
        produto.grupo_precificacao_id,
        produto.valor_venda,
        produto.ativo,
      ]
    );

    return (result as any).insertId;
  }

  async insertEstoqueProduto(
    produto_id: number,
    quantidade_inicial: number
  ): Promise<number> {
    const [result] = await this.db.query(
      `INSERT INTO estoque (produto_id, quantidade_disponivel) VALUES (?, ?)`,
      [produto_id, quantidade_inicial]
    );

    return (result as any).insertId;
  }

  async adicionarImagemProduto(
    produto_id: number,
    imagem: any
  ): Promise<number> {
    const [result] = await this.db.query(
      `INSERT INTO produtos_imagens (produto_id, url_imagem, ordem, principal) VALUES (?, ?, ?, ?)`,
      [produto_id, imagem.url_imagem, imagem.ordem, imagem.principal]
    );

    return (result as any).insertId;
  }

  async associarCategoriaProduto(
    produto_id: number,
    categoria_id: number
  ): Promise<number> {
    const [result] = await this.db.query(
      `INSERT INTO produtos_categorias (produto_id, categoria_id) VALUES (?, ?)`,
      [produto_id, categoria_id]
    );

    return (result as any).insertId;
  }

  async update(id: number, produto: Produto): Promise<boolean> {
    const [result] = await this.db.query(
      `UPDATE produtos SET
        codigo = ?,
        nome_produto = ?,
        fabricante_id = ?,
        ano_lancamento = ?,
        descricao = ?,
        codigo_barras = ?,
        altura = ?,
        largura = ?,
        profundidade = ?,
        peso = ?,
        grupo_precificacao_id = ?,
        valor_venda = ?,
        ativo = ? 
      WHERE id = ?`,
      [
        produto.codigo,
        produto.nome_produto,
        produto.fabricante_id,
        produto.ano_lancamento,
        produto.descricao,
        produto.codigo_barras,
        produto.altura,
        produto.largura,
        produto.profundidade,
        produto.peso,
        produto.grupo_precificacao_id,
        produto.valor_venda,
        produto.ativo,
        id,
      ]
    );

    return (result as any).insertId;
  }

  async updateEstoqueProduto(
    produto_id: number,
    quantidade_inicial: number
  ): Promise<number> {
    const [result] = await this.db.query(
      `UPDATE estoque SET quantidade_disponivel = ? WHERE produto_id = ?`,
      [quantidade_inicial, produto_id]
    );

    return (result as any).insertId;
  }

  async removerImagemProduto(produto_id: number, imagem: any): Promise<number> {
    const [result] = await this.db.query(
      `DELETE FROM produtos_imagens WHERE produto_id = ? AND url_imagem = ?`,
      [produto_id, imagem.url_imagem]
    );

    return (result as any).insertId;
  }

  async desassociarCategoriaProduto(
    produto_id: number,
    categoria_id: number
  ): Promise<number> {
    const [result] = await this.db.query(
      `DELETE FROM produtos_categorias WHERE produto_id = ? AND categoria_id = ?`,
      [produto_id, categoria_id]
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

  async getGruposPrecificacao(): Promise<any[]> {
    const [rows] = await this.db.query("SELECT * FROM grupos_precificacao");
    return rows as any[];
  }

  async getCategoriasByProdutoId(produtoId: number): Promise<any[]> {
    const [rows] = await this.db.query(
      "SELECT C.* FROM categorias C INNER JOIN produtos_categorias PC ON C.id = PC.categoria_id WHERE PC.produto_id = ?",
      [produtoId]
    );
    return rows as any[];
  }

  async getImagensByProdutoId(produtoId: number): Promise<any[]> {
    const [rows] = await this.db.query(
      "SELECT PI.* FROM produtos_imagens PI INNER JOIN produtos P ON PI.produto_id = P.id WHERE P.id = ?",
      [produtoId]
    );
    return rows as any[];
  }

  async increaseEstoqueProduto(
    produto_id: number,
    quantidadeParaAdicionar: number
  ): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE estoque SET quantidade_disponivel = quantidade_disponivel + ? WHERE produto_id = ?",
      [quantidadeParaAdicionar, produto_id]
    );

    return (result as any).insertId;
  }

  async decreaseEstoqueProduto(
    produto_id: number,
    quantidadeParaRemover: number
  ): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE estoque SET quantidade_disponivel = quantidade_disponivel - ? WHERE produto_id = ?",
      [quantidadeParaRemover, produto_id]
    );

    return (result as any).insertId;
  }

  async desativarProduto(
    produto_id: number,
    categoria_inativacao_id: number
  ): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE produtos SET ativo = 0, categoria_inativacao_id = ? WHERE id = ?",
      [categoria_inativacao_id, produto_id]
    );
    return (result as any).affectedRows > 0;
  }

  async ativarProduto(
    produto_id: number,
    categoria_ativacao_id: number
  ): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE produtos SET ativo = 1, categoria_ativacao_id = ? WHERE id = ?",
      [categoria_ativacao_id, produto_id]
    );
    return (result as any).affectedRows > 0;
  }

  async registrarLogProduto(log: any): Promise<boolean> {
    const [result] = await this.db.query(
      "INSERT INTO logs_produtos (produto_id, tipo_alteracao, motivo, cat_inativacao, cat_ativacao, estoque_ant, estoque_novo, estado_ant, estado_novo, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        log.produto_id,
        log.tipo_alteracao,
        log.motivo,
        log.cat_inativacao,
        log.cat_ativacao,
        log.estoque_ant,
        log.estoque_novo,
        log.estado_ant,
        log.estado_novo,
        log.usuario_id,
      ]
    );

    return (result as any).affectedRows > 0;
  }

  async getAllLogsProduto(): Promise<any[]> {
    const [rows] = await this.db.query(
      `SELECT 
      L.*, 
      C.nome_cliente, 
      A.nome AS nome_ativacao, 
      I.nome AS nome_inativacao,
      P.nome_produto
        FROM logs_produtos L
        LEFT JOIN clientes C ON L.usuario_id = C.id_cliente
        LEFT JOIN categorias_ativacao A ON L.cat_ativacao = A.id
        LEFT JOIN categorias_inativacao I ON L.cat_inativacao = I.id
        LEFT JOIN produtos P ON L.produto_id = P.id
        ORDER BY L.data_alteracao DESC`
    );

    return rows as any[];
  }
}
