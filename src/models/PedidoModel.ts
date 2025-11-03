export class Pedido {
  id_pedido?: number;
  id_cliente: number;
  id_endereco_entrega: number;
  status_id: number;
  valor_produtos: number;
  valor_frete: number;
  valor_desconto: number;
  valor_total: number;
  pagamentos: any[];
  produtos?: any[];

  constructor(
    id_cliente: number,
    id_endereco_entrega: number,
    status_id: number,
    valor_produtos: number,
    valor_frete: number,
    valor_desconto: number,
    valor_total: number,
    pagamentos: any[],
    produtos?: any[],
    id_pedido?: number
  ) {
    this.id_pedido = id_pedido;
    this.id_cliente = id_cliente;
    this.id_endereco_entrega = id_endereco_entrega;
    this.status_id = status_id;
    this.valor_produtos = valor_produtos;
    this.valor_frete = valor_frete;
    this.valor_desconto = valor_desconto;
    this.valor_total = valor_total;
    this.pagamentos = pagamentos;
    this.produtos = produtos;
  }
}
