import { Cartao } from "./CartaoModel";
import { Endereco } from "./EnderecoModel";

export class Cliente {
  id_cliente?: number;
  genero: string;
  nome_cliente: string;
  data_nascimento: string;
  cpf: string;
  telefone_tipo: string;
  telefone_numero: string;
  email: string;
  senha: string;
  ranking: number;
  cliente_ativo: boolean;
  enderecos?: Endereco[];
  cartoes?: Cartao[];

  constructor(
    genero: string,
    nomeCliente: string,
    dataNascimento: string,
    cpf: string,
    telefone_tipo: string,
    telefone_numero: string,
    email: string,
    senha: string,
    ranking: number,
    cliente_ativo: boolean,
    enderecos?: Endereco[],
    cartoes?: Cartao[],
    id_cliente?: number
  ) {
    this.id_cliente = id_cliente;
    this.genero = genero;
    this.nome_cliente = nomeCliente;
    this.data_nascimento = dataNascimento;
    this.cpf = cpf;
    this.telefone_tipo = telefone_tipo;
    this.telefone_numero = telefone_numero;
    this.email = email;
    this.senha = senha;
    this.ranking = ranking;
    this.cliente_ativo = cliente_ativo;
    this.enderecos = enderecos;
    this.cartoes = cartoes;
  }
}
