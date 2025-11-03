import { Pedido } from "../models/PedidoModel";
import { PedidoDAO } from "../dao/PedidoDAO";
import { IFacade } from "./IFacade";
import { getPedidosByClienteId } from "../controllers/PedidoController";
import { ProdutoDAO } from "../dao/ProdutoDAO";
import { CarrinhoDAO } from "../dao/CarrinhoDAO";

export default class PedidoFacade implements IFacade<Pedido> {
  // #region singletonConfig
  // Variável privada para o singleton
  private static instance?: PedidoFacade;

  // Construtor privado para evitar instanciamentos
  private constructor() {}

  // Método para obter a instância do singleton
  public static getInstance(): PedidoFacade {
    if (!PedidoFacade.instance) {
      PedidoFacade.instance = new PedidoFacade();
    }
    return PedidoFacade.instance;
  }
  // #endregion

  // Não utilizado
  async getAll(): Promise<Pedido[]> {
    return await PedidoDAO.getInstance().getAll();
  }

  async getById(id: number): Promise<Pedido | null> {
    return await PedidoDAO.getInstance().getById(id);
  }

  async create(pedido: Pedido): Promise<{ [key: string]: any }> {
    let camposInvalidos: string = "";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) };
    }

    // cria o pedido e obtém o id gerado
    const insertId = await PedidoDAO.getInstance().create(pedido);

    if (!insertId) return { status: "erro" };

    // insere os itens um a um
    if (pedido.produtos && pedido.produtos.length) {
      for (const produto of pedido.produtos) {
        const item = {
          pedido_id: insertId,
          produto_id: produto.produto_id,
          quantidade: produto.quantidade ?? 1,
          valor_unitario: produto.valor_unitario ?? 0,
          valor_total: produto.valor_total ?? 0,
        };

        const ok = await PedidoDAO.getInstance().insertPedidoItem(item);
        if (!ok) {
          return { status: "erro_itens" };
        }
      }
    }

    await CarrinhoDAO.getInstance().clearByClienteId(pedido.id_cliente);

    return {};
  }

  // Não utilizado
  async update(id: number, pedido: Pedido): Promise<{ [key: string]: any }> {
    let camposInvalidos: string = "";

    if (camposInvalidos) {
      return { campos_invalidos: camposInvalidos.slice(0, -2) }; // Remove a última vírgula ', '
    }
    // return {};

    return (await PedidoDAO.getInstance().update(id, pedido))
      ? {}
      : { status: "erro" };
  }

  // Não utilizado
  async delete(id: number): Promise<boolean> {
    return await PedidoDAO.getInstance().delete(id);
  }

  async getPedidosByClienteId(clienteId: number): Promise<Pedido[]> {
    let pedidos: Pedido[] = await PedidoDAO.getInstance().getByClienteId(
      clienteId
    );
    for (let pedido of pedidos) {
      pedido.produtos = await ProdutoDAO.getInstance().getProdutosByPedidoId(
        pedido.id_pedido!
      );
      pedido.pagamentos = await PedidoDAO.getInstance().getPagamentosByPedidoId(
        pedido.id_pedido!
      );
    }
    return pedidos;
  }

  async updateStatus(
    id: number,
    status_id: number
  ): Promise<{ [key: string]: any }> {
    return (await PedidoDAO.getInstance().updateStatus(id, status_id))
      ? {}
      : { status: "erro" };
  }
}
