export class ProdutoCarrinho {
  id_cliente: number;
  produto_id: number;
  quantidade: number;
  ativo: boolean;
  nome_produto?: string;
  valor_venda?: number;
  url_imagem?: string;

  constructor(
    id_cliente: number,
    produto_id: number,
    quantidade: number,
    ativo: boolean,
    nome_produto?: string,
    valor_venda?: number,
    url_imagem?: string
  ) {
    this.id_cliente = id_cliente;
    this.produto_id = produto_id;
    this.quantidade = quantidade;
    this.ativo = ativo;
    this.nome_produto = nome_produto;
    this.valor_venda = valor_venda;
    this.url_imagem = url_imagem;
  }
}
