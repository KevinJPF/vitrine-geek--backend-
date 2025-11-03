export class Produto {
  id_produto?: number;
  nome_produto: string;
  valor_venda: number;
  url_imagem: string;

  constructor(
    nome_produto: string,
    valor_venda: number,
    url_imagem: string,
    id_produto?: number
  ) {
    this.id_produto = id_produto;
    this.nome_produto = nome_produto;
    this.valor_venda = valor_venda;
    this.url_imagem = url_imagem;
  }
}
