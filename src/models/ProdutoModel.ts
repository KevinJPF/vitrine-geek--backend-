export class Produto {
  id?: number;
  codigo: string;
  nome_produto: string;
  fabricante_id: number;
  ano_lancamento: number;
  descricao: string;
  codigo_barras: string;
  altura: number;
  largura: number;
  profundidade: number;
  peso: number;
  grupo_precificacao_id: number;
  valor_venda: number;
  ativo: boolean;
  quantidade_disponivel: number;
  url_imagem: string;
  categorias: any[];
  imagens: any[];

  constructor(
    codigo: string,
    nome_produto: string,
    fabricante_id: number,
    ano_lancamento: number,
    descricao: string,
    codigo_barras: string,
    altura: number,
    largura: number,
    profundidade: number,
    peso: number,
    grupo_precificacao_id: number,
    valor_venda: number,
    quantidade_disponivel: number,
    ativo: boolean,
    url_imagem?: string,
    categorias?: any[],
    imagens?: any[],
    id_produto?: number
  ) {
    this.id = id_produto;
    this.codigo = codigo;
    this.nome_produto = nome_produto;
    this.fabricante_id = fabricante_id;
    this.ano_lancamento = ano_lancamento;
    this.descricao = descricao;
    this.codigo_barras = codigo_barras;
    this.altura = altura;
    this.largura = largura;
    this.profundidade = profundidade;
    this.peso = peso;
    this.grupo_precificacao_id = grupo_precificacao_id;
    this.valor_venda = valor_venda;
    this.quantidade_disponivel = quantidade_disponivel;
    this.ativo = ativo;
    this.url_imagem = url_imagem || "";
    this.categorias = categorias || [];
    this.imagens = imagens || [];
  }
}
