import { Request, Response } from "express";
import { Endereco } from "../models/EnderecoModel";
import EnderecoFacade from "../facades/EnderecoFacade";

const validarCamposObrigatorios = (endereco: any) => {
  const requiredFields = [
    "nome_endereco",
    "tipo_residencia",
    "tipo_logradouro",
    "logradouro",
    "numero",
    "bairro",
    "cep",
    "cidade",
    "estado",
    "pais",
    "obs_endereco",
    "endereco_entrega",
    "endereco_cobranca",
    "favorito",
    "id_cliente",
  ];

  const missingFields = requiredFields.filter(
    (field) => !Object.prototype.hasOwnProperty.call(endereco, field)
  );

  return missingFields;
};

export const getEnderecos = async (req: Request, res: Response) => {
  const enderecos = await EnderecoFacade.getInstance().getAll();
  res.json(enderecos);
};

export const getEnderecoPorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const endereco = await EnderecoFacade.getInstance().getById(id);
  if (!endereco) {
    return res.status(404).json({ message: "Endereço não encontrado" });
  }
  res.json(endereco);
};

export const createEndereco = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  // Variável com valor de endereco enviado pela requisição
  const novoEndereco = new Endereco(
    req.body.nome_endereco,
    req.body.tipo_residencia,
    req.body.tipo_logradouro,
    req.body.logradouro,
    req.body.numero,
    req.body.bairro,
    req.body.cep,
    req.body.cidade,
    req.body.estado,
    req.body.pais,
    req.body.obs_endereco,
    req.body.endereco_entrega,
    req.body.endereco_cobranca,
    req.body.favorito,
    req.body.id_cliente
  );

  // Cria o endereco no banco de dados
  const newEndereco = await EnderecoFacade.getInstance().create(novoEndereco);

  // Retorna o endereco criado caso sucesso
  res.status(201).json(newEndereco);
};

export const updateEndereco = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  const id = Number(req.params.id);
  const enderecoAtualizado = new Endereco(
    req.body.nome_endereco,
    req.body.tipo_residencia,
    req.body.tipo_logradouro,
    req.body.logradouro,
    req.body.numero,
    req.body.bairro,
    req.body.cep,
    req.body.cidade,
    req.body.estado,
    req.body.pais,
    req.body.obs_endereco,
    req.body.endereco_entrega,
    req.body.endereco_cobranca,
    req.body.favorito,
    req.body.id_cliente
  );

  // Verifica se o endereco existe
  const enderecoExistente = await EnderecoFacade.getInstance().getById(id);
  if (!enderecoExistente) {
    return res.status(404).json({ message: "Endereco não encontrado" });
  }

  // Atualiza o endereco no banco de dados
  const updatedEndereco = await EnderecoFacade.getInstance().update(id, {
    ...enderecoAtualizado,
  });

  res.json(updatedEndereco);
};

export const deleteEndereco = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const enderecoExistente = await EnderecoFacade.getInstance().getById(id);
  if (!enderecoExistente) {
    return res.status(404).json({ message: "Endereco não encontrado" });
  }

  res.status(200).send(await EnderecoFacade.getInstance().delete(id));
};
