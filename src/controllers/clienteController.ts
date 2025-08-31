import { Request, Response } from "express";
import ClienteFachada from "../facades/ClienteFacade";

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

export const createCliente = (req: Request, res: Response) => {
  //   const { name, email } = req.body;
  //   const newCliente: Cliente = { id: users.length + 1, name, email };
  //   users.push(newCliente);
  //   res.status(201).json(newCliente);
};
