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
      "SELECT P.*, I.*, S.nome as 'status_nome', S.descricao as 'status_descricao', C.nome_cliente FROM pedidos P LEFT JOIN pedidos_pagamentos I ON P.id_pedido = I.id_pedido LEFT JOIN status_pedido S ON P.status_id = S.id LEFT JOIN clientes C ON P.id_cliente = C.id_cliente"
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

  async getByClienteId(clienteId: number): Promise<Pedido[]> {
    const [rows] = await this.db.query(
      "SELECT P.*, I.*, S.nome as 'status_nome', S.descricao as 'status_descricao' FROM pedidos P LEFT JOIN pedidos_pagamentos I ON P.id_pedido = I.id_pedido LEFT JOIN status_pedido S ON P.status_id = S.id WHERE  P.id_cliente = ?",
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
}
