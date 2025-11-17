import { Request, Response } from "express";
import { ChatFacade } from "../facades/ChatFacade";

export const sendMessage = async (req: Request, res: Response) => {
  const facade = new ChatFacade();
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem não enviada." });
    }

    const reply = await facade.processMessage(message, history);
    return res.json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar IA." });
  }
};
