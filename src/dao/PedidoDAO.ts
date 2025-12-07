import { Pedido } from "../models/PedidoModel";
import { BaseDAO } from "./BaseDAO";

export class PedidoDAO extends BaseDAO<Pedido> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: PedidoDAO;

  // Construtor privado para evitar instanciamentos
  private constructor() {
    super();
  }

  // Método para obter a instância do singleton
  public static getInstance(): PedidoDAO {
    if (!PedidoDAO.instance) {
      PedidoDAO.instance = new PedidoDAO();
    }
    return PedidoDAO.instance;
  }
  // #endregion

  async getAll(): Promise<Pedido[]> {
    const [rows] = await this.db.query(
      "SELECT P.*, S.nome as 'status_nome', S.descricao as 'status_descricao', C.nome_cliente FROM pedidos P LEFT JOIN status_pedido S ON P.status_id = S.id LEFT JOIN clientes C ON P.id_cliente = C.id_cliente"
    );
    return rows as Pedido[];
  }

  async getById(id: number): Promise<Pedido | null> {
    const [rows] = await this.db.query(
      "SELECT P.*, I.*, S.nome as 'status_nome', S.descricao as 'status_descricao' FROM pedidos P LEFT JOIN pedidos_pagamentos I ON P.id_pedido = I.id_pedido LEFT JOIN status_pedido S ON P.status_id = S.id WHERE P.id_pedido = ?",
      [id]
    );
    const produtos = rows as Pedido[];
    return produtos.length ? produtos[0] : null;
  }

  async create(pedido: Pedido): Promise<number> {
    const [result] = await this.db.query(
      "INSERT INTO pedidos (id_cliente, id_endereco_entrega, status_id, valor_produtos, valor_frete, valor_desconto, valor_total) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        pedido.id_cliente,
        pedido.id_endereco_entrega,
        pedido.status_id,
        pedido.valor_produtos,
        pedido.valor_frete,
        pedido.valor_desconto,
        pedido.valor_total,
      ]
    );

    pedido.pagamentos.forEach(async (pagamento) => {
      pagamento.id_pedido = (result as any).insertId;
      await this.insertPedidoPagamento(pagamento);
    });

    return (result as any).insertId;
  }

  // Não utilizado
  async update(id: number, pedido: Pedido): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE pedidos SET id_cliente = ?, id_endereco_entrega = ?, status_id = ?, valor_produtos = ?, valor_frete = ?, valor_desconto = ?, valor_total = ? WHERE id_pedido = ?",
      [
        pedido.id_cliente,
        pedido.id_endereco_entrega,
        pedido.status_id,
        pedido.valor_produtos,
        pedido.valor_frete,
        pedido.valor_desconto,
        pedido.valor_total,
        id,
      ]
    );

    // pedido.pagamentos.forEach(async (pagamento) => {
    // TODO: await this.insertPedidoPagamento(pagamento); // Implementar atualização de pagamentos
    // });

    return (result as any).insertId;
  }

  // Não utilizado
  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.query("DELETE FROM produtos WHERE id = ?", [
      id,
    ]);
    return (result as any).affectedRows > 0;
  }

  async insertPedidoPagamento(pagamento: any): Promise<boolean> {
    const [result] = await this.db.query(
      "INSERT INTO pedidos_pagamentos (id_pedido, id_cartao, valor_pago, aprovado) VALUES (?, ?, ?, ?)",
      [
        pagamento.id_pedido,
        pagamento.id_cartao,
        pagamento.valor_pago,
        pagamento.aprovado,
      ]
    );

    return (result as any).affectedRows > 0;
  }

  async insertPedidoItem(item: any): Promise<boolean> {
    const [result] = await this.db.query(
      "INSERT INTO pedidos_itens (pedido_id, produto_id, quantidade, valor_unitario, valor_total) VALUES (?, ?, ?, ?, ?)",
      [
        item.pedido_id ?? item.id_pedido,
        item.produto_id ?? item.id_produto,
        item.quantidade ?? 1,
        item.valor_unitario ?? 0,
        item.valor_total ?? 0,
      ]
    );

    return (result as any).affectedRows > 0;
  }

  async removePedidoItem(
    produtoId: number,
    pedidoId: number
  ): Promise<boolean> {
    const [result] = await this.db.query(
      "DELETE FROM pedidos_itens WHERE produto_id = ? AND pedido_id = ? ",
      [produtoId, pedidoId]
    );

    return (result as any).affectedRows > 0;
  }

  async getByClienteId(clienteId: number): Promise<Pedido[]> {
    const [rows] = await this.db.query(
      "SELECT P.*, S.nome as 'status_nome', S.descricao as 'status_descricao' FROM pedidos P LEFT JOIN status_pedido S ON P.status_id = S.id WHERE  P.id_cliente = ?",
      [clienteId]
    );
    return rows as Pedido[];
  }

  async getPagamentosByPedidoId(pedidoId: number): Promise<Pedido[]> {
    const [rows] = await this.db.query(
      "SELECT I.* FROM pedidos_pagamentos I WHERE I.id_pedido = ?",
      [pedidoId]
    );
    return rows as Pedido[];
  }

  async updateStatus(id: number, status_id: number): Promise<boolean> {
    const [result] = await this.db.query(
      "UPDATE pedidos SET status_id = ? WHERE id_pedido = ?",
      [status_id, id]
    );

    return (result as any).affectedRows > 0;
  }

  async insertCupomTroca(cupom: any): Promise<boolean> {
    const [result] = await this.db.query(
      "INSERT INTO cupons (codigo, tipo_cupom_id, id_cliente, valor, data_validade, ativo, quantidade, pedido_origem_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "CT" + cupom.id_cliente + cupom.pedido_origem_id,
        1,
        cupom.id_cliente,
        cupom.valor,
        null,
        true,
        1,
        cupom.pedido_origem_id,
      ]
    );

    return (result as any).affectedRows > 0;
  }

  async getCupomByCodigo(cupomCodigo: string): Promise<Object> {
    const [rows] = await this.db.query(
      "SELECT C.* FROM cupons C WHERE C.codigo = ?",
      [cupomCodigo]
    );

    return rows as Object;
  }

  async getPedidosPeriodo(
    periodoInicio: string,
    periodoFim: string,
    produtoId?: number | null,
    categoriaId?: number | null
  ): Promise<Pedido[]> {
    const sql = `
    SELECT 
    p.id_pedido AS id_pedido,
    p.valor_total,
    p.atualizado_em,
    c.nome_cliente AS nome_cliente,

    pi.produto_id,
    pr.nome_produto AS produto_nome,
    pi.quantidade,
    pi.valor_total AS valor_total_item,
    pc.categoria_id,
    cat.nome AS categoria_nome

    FROM pedidos p
    JOIN clientes c ON c.id_cliente = p.id_cliente
    JOIN pedidos_itens pi ON pi.pedido_id = p.id_pedido
    JOIN produtos pr ON pr.id = pi.produto_id
    LEFT JOIN produtos_categorias pc ON pc.produto_id = pr.id
    LEFT JOIN categorias cat ON cat.id = pc.categoria_id

    WHERE p.status_id = 5
      AND p.atualizado_em BETWEEN ? AND ?
    AND (? IS NULL OR pi.produto_id = ?)
    AND (? IS NULL OR pc.categoria_id = ?)
  `;

    const params = [
      periodoInicio,
      periodoFim,
      produtoId ?? null,
      produtoId ?? null,
      categoriaId ?? null,
      categoriaId ?? null,
    ];

    const [rows] = await this.db.query(sql, params);

    return rows as Pedido[];
  }

  async registrarLogPedido(log: any): Promise<boolean> {
    const [result] = await this.db.query(
      "INSERT INTO logs_pedidos (pedido_id, status_ant, status_novo, motivo, usuario_id, tipo_alteracao) VALUES (?, ?, ?, ?, ?, ?)",
      [
        log.pedido_id,
        log.status_anterior,
        log.status_novo,
        log.motivo,
        log.usuario_id,
        log.tipo_alteracao,
      ]
    );

    return (result as any).affectedRows > 0;
  }

  async getAllLogsPedido(): Promise<any[]> {
    const [rows] = await this.db.query(
      "SELECT " +
        "L.*, " +
        "C.nome_cliente, " +
        "S1.nome AS nome_status_ant, " +
        "S2.nome AS nome_status_novo " +
        "FROM logs_pedidos L " +
        "LEFT JOIN clientes C ON L.usuario_id = C.id_cliente " +
        "LEFT JOIN pedidos P ON L.pedido_id = P.id_pedido " +
        "LEFT JOIN status_pedido S1 ON L.status_ant = S1.id " +
        "LEFT JOIN status_pedido S2 ON L.status_novo = S2.id " +
        "ORDER BY L.data_alteracao DESC"
    );
    return rows as any[];
  }
}
