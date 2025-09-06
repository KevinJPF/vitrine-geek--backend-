export class Cartao {
  id_cartao?: number;
  nome_cartao: string;
  numero_cartao: string;
  nome_impresso: string;
  id_bandeira: number;
  codigo_seguranca: string;
  favorito: boolean;
  id_cliente: number;
  nome_bandeira?: string;

  constructor(
    nome_cartao: string,
    numero_cartao: string,
    nome_impresso: string,
    id_bandeira: number,
    codigo_seguranca: string,
    favorito: boolean,
    id_cliente: number,
    nome_bandeira?: string,
    id_cartao?: number
  ) {
    this.id_cartao = id_cartao;
    this.nome_cartao = nome_cartao;
    this.numero_cartao = numero_cartao;
    this.nome_impresso = nome_impresso;
    this.id_bandeira = id_bandeira;
    this.favorito = favorito;
    this.codigo_seguranca = codigo_seguranca;
    this.id_cliente = id_cliente;
    this.nome_bandeira = nome_bandeira;
  }
}
