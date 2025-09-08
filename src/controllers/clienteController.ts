import { Request, Response } from "express";
import { Cliente } from "../models/ClienteModel";
import ClienteFachada from "../facades/ClienteFacade";

const validarCamposObrigatorios = (cliente: any) => {
  const requiredFields = [
    "genero",
    "nome_cliente",
    "data_nascimento",
    "cpf",
    "telefone_tipo",
    "telefone_ddd",
    "telefone_numero",
    "email",
    "senha",
  ];

  const missingFields = requiredFields.filter(
    (field) => !Object.prototype.hasOwnProperty.call(cliente, field)
  );

  return missingFields;
};

export const getClientes = async (req: Request, res: Response) => {
  const clientes = await ClienteFachada.getInstance().getAll();
  res.json(clientes);
};

export const getClientePorId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const cliente = await ClienteFachada.getInstance().getById(id);
  if (!cliente) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }
  res.json(cliente);
};

export const createCliente = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  // Variável com valor de cliente enviado pela requisição
  const novoCliente = new Cliente(
    req.body.genero,
    req.body.nome_cliente,
    req.body.data_nascimento,
    req.body.cpf,
    req.body.telefone_tipo,
    req.body.telefone_ddd,
    req.body.telefone_numero,
    req.body.email,
    req.body.senha,
    req.body.enderecos,
    req.body.cartoes
  );

  // Cria o cliente no banco de dados
  const newCliente = await ClienteFachada.getInstance().create(novoCliente);

  if (Object.keys(newCliente).length === 0) {
    // Retorna o cliente criado caso sucesso
    res.status(201).json(novoCliente);
  } else {
    res.status(400).json({ campos_invalidos: newCliente });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  // Verifica se todos os campos obrigatórios estão presentes
  const missingFields = validarCamposObrigatorios(req.body);
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatórios ausentes",
      missingFields,
    });
  }

  const id = Number(req.params.id);
  const clienteAtualizado = new Cliente(
    req.body.genero,
    req.body.nome_cliente,
    req.body.data_nascimento,
    req.body.cpf,
    req.body.telefone_tipo,
    req.body.telefone_ddd,
    req.body.telefone_numero,
    req.body.email,
    req.body.senha,
    req.body.enderecos,
    req.body.cartoes
  );

  // Verifica se o cliente existe
  const clienteExistente = await ClienteFachada.getInstance().getById(id);
  if (!clienteExistente) {
    return res.status(404).json({ message: "Cliente não encontrado" });
  }

  // Atualiza o cliente no banco de dados
  const updatedCliente = await ClienteFachada.getInstance().update(
    id,
    {
      ...clienteAtualizado,
    },
    { ...clienteExistente }
  );

  if (Object.keys(updatedCliente).length === 0) {
    // Retorna o cliente criado caso sucesso
    res.status(200).json(clienteAtualizado);
  } else {
    res.status(400).json({ campos_invalidos: updatedCliente });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const clienteExistente = await ClienteFachada.getInstance().getById(id);
  if (!clienteExistente) {
    return res.status(404).json({ message: "Cliente não encontrado" });
  }

  res.status(200).send(await ClienteFachada.getInstance().delete(id));
};

export const activateOrDeactivateCliente = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const clienteExistente = await ClienteFachada.getInstance().getById(id);
  if (!clienteExistente) {
    return res.status(404).json({ message: "Cliente não encontrado" });
  }

  const ativo = !clienteExistente.cliente_ativo;

  const resultado = await ClienteFachada.getInstance().activateOrDeactivate(
    id,
    ativo
  );
  if (resultado) {
    return res.status(200).json({
      message: `Cliente ${ativo ? "ativado" : "desativado"} com sucesso`,
    });
  }

  res
    .status(500)
    .json({ message: `Erro ao ${ativo ? "ativar" : "desativar"} cliente` });
};

export const updateSenhaCliente = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { senha } = req.body;

  // Verifica se a nova senha foi fornecida
  if (!senha) {
    return res.status(400).json({ message: "Nova senha não fornecida" });
  }

  const clienteExistente = await ClienteFachada.getInstance().getById(id);
  if (!clienteExistente) {
    return res.status(404).json({ message: "Cliente não encontrado" });
  }

  // Atualiza a senha do cliente
  const resultado = await ClienteFachada.getInstance().changePassword(
    id,
    senha
  );

  if (resultado) {
    return res.status(200).json({ message: "Senha atualizada com sucesso" });
  }

  res.status(500).json({ message: "Erro ao atualizar senha" });
};
