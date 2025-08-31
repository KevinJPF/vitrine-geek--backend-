import { Request, Response } from 'express';

interface Cliente {
  id: number;
  name: string;
  email: string;
}

let users: Cliente[] = [];

export const getClientes = (req: Request, res: Response) => {
  const newCliente: Cliente = { id: 1, name: "kevin", email: "kevin@email.com" };
  users.push(newCliente)
  res.json(users);
};

export const createCliente = (req: Request, res: Response) => {
  const { name, email } = req.body;
  const newCliente: Cliente = { id: users.length + 1, name, email };
  users.push(newCliente);
  res.status(201).json(newCliente);
};
