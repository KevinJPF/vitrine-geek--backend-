export class Endereco {
  id_endereco?: number;
  nome_endereco: string;
  tipo_residencia: string;
  tipo_logradouro: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  pais: string;
  obs_endereco: string;
  endereco_entrega: boolean;
  endereco_cobranca: boolean;
  favorito: boolean;
  id_cliente: number;

  constructor(
    nome_endereco: string,
    tipo_residencia: string,
    tipo_logradouro: string,
    logradouro: string,
    numero: string,
    bairro: string,
    cep: string,
    cidade: string,
    estado: string,
    pais: string,
    obs_endereco: string,
    endereco_entrega: boolean,
    endereco_cobranca: boolean,
    favorito: boolean,
    id_cliente: number,
    id_endereco?: number
  ) {
    this.id_endereco = id_endereco;
    this.nome_endereco = nome_endereco;
    this.tipo_residencia = tipo_residencia;
    this.tipo_logradouro = tipo_logradouro;
    this.logradouro = logradouro;
    this.numero = numero;
    this.bairro = bairro;
    this.cep = cep;
    this.cidade = cidade;
    this.estado = estado;
    this.pais = pais;
    this.obs_endereco = obs_endereco;
    this.endereco_entrega = endereco_entrega;
    this.endereco_cobranca = endereco_cobranca;
    this.favorito = favorito;
    this.id_cliente = id_cliente;
  }
}
