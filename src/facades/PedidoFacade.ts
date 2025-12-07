import { Pedido } from "../models/PedidoModel";
import { PedidoDAO } from "../dao/PedidoDAO";
import { IFacade } from "./IFacade";
import { getPedidosByClienteId } from "../controllers/PedidoController";
import { ProdutoDAO } from "../dao/ProdutoDAO";
import { CarrinhoDAO } from "../dao/CarrinhoDAO";
import ProdutoFacade from "./ProdutoFacade";

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
    const pedido = await PedidoDAO.getInstance().getById(id);

    pedido!.produtos = await ProdutoDAO.getInstance().getProdutosByPedidoId(
      pedido!.id_pedido!
    );
    pedido!.pagamentos = await PedidoDAO.getInstance().getPagamentosByPedidoId(
      pedido!.id_pedido!
    );

    return pedido;
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

        if (pedido.status_id !== 6) {
          ProdutoFacade.getInstance().decreaseEstoqueProduto(
            item.produto_id,
            item.quantidade,
            "Saída por realização de pedido"
          );
        }

        const ok = await PedidoDAO.getInstance().insertPedidoItem(item);
        if (!ok) {
          return { status: "erro_itens" };
        }
      }
    }

    await CarrinhoDAO.getInstance().clearByClienteId(pedido.id_cliente);

    await PedidoDAO.getInstance().registrarLogPedido({
      pedido_id: insertId,
      status_anterior: null,
      status_novo: 1,
      motivo: "Realização de pedido",
      usuario_id: 1,
      tipo_alteracao: "create",
    });

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
    const pedido = await this.getById(id);
    if (status_id == 8) {
      if (pedido) {
        await PedidoDAO.getInstance().insertCupomTroca({
          id_cliente: pedido.id_cliente,
          valor: pedido.valor_total,
          pedido_origem_id: pedido.id_pedido,
        });

        for (let produto of pedido.produtos!) {
          await ProdutoFacade.getInstance().increaseEstoqueProduto(
            produto.produto_id,
            produto.quantidade,
            "Entrada por troca de pedido"
          );
        }
      }
    }

    await PedidoDAO.getInstance().registrarLogPedido({
      pedido_id: id,
      status_anterior: pedido!.status_id!,
      status_novo: status_id,
      motivo: "Alteração de status",
      usuario_id: 1,
      tipo_alteracao: "atualizacao",
    });

    return (await PedidoDAO.getInstance().updateStatus(id, status_id))
      ? {}
      : { status: "erro" };
  }

  async getCupomByCodigo(codigo: string): Promise<any> {
    return await PedidoDAO.getInstance().getCupomByCodigo(codigo);
  }

  async getPedidosPeriodo(
    dataInicio: string,
    dataFim: string,
    produtoId?: number | null,
    categoriaId?: number | null
  ): Promise<Pedido[]> {
    return await PedidoDAO.getInstance().getPedidosPeriodo(
      dataInicio,
      dataFim,
      produtoId,
      categoriaId
    );
  }

  async realizarTroca(pedidoAtualizado: Pedido): Promise<any> {
    const pedidoExistente = await this.getById(pedidoAtualizado.id_pedido!);
    if (!pedidoExistente) {
      return { status: "erro_pedido_nao_encontrado" };
    }

    if (pedidoExistente.produtos!.length == pedidoAtualizado.produtos!.length) {
      this.updateStatus(pedidoAtualizado.id_pedido!, 6);
      return { status: "sucesso" };
    } else {
      this.create(pedidoAtualizado);
      for (let produto of pedidoAtualizado.produtos!) {
        await PedidoDAO.getInstance().removePedidoItem(
          produto.produto_id,
          pedidoExistente.id_pedido!
        );
      }
      return { status: "sucesso" };
    }
  }

  async getAllLogsPedido(): Promise<any[]> {
    return await PedidoDAO.getInstance().getAllLogsPedido();
  }
}
