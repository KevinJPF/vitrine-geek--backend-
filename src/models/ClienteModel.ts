import { BaseEntidade } from "./BaseEntidade";

export class Cliente extends BaseEntidade {
  genero: string;
  nomeCliente: string;
  dataNascimento: string;
  cpf: string;
  telefoneTipo: string;
  telefoneNumero: string;
  email: string;
  senha: string;
  ranking: number;
  clienteAtivo: boolean;
  // List<Endereco> enderecos;
  // List<CartaoCredito> cartoesCredito;

  constructor(
    genero: string,
    nomeCliente: string,
    dataNascimento: string,
    cpf: string,
    telefoneTipo: string,
    telefoneNumero: string,
    email: string,
    senha: string,
    ranking: number,
    clienteAtivo: boolean,
    id?: number
  ) {
    super();
    this.id = id;
    this.genero = genero;
    this.nomeCliente = nomeCliente;
    this.dataNascimento = dataNascimento;
    this.cpf = cpf;
    this.telefoneTipo = telefoneTipo;
    this.telefoneNumero = telefoneNumero;
    this.email = email;
    this.senha = senha;
    this.ranking = ranking;
    this.clienteAtivo = clienteAtivo;
  }
}
