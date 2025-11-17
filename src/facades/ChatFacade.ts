import { ChatService } from "../config/chatService";

export class ChatFacade {
  private service = new ChatService();

  async processMessage(message: string, history: any[]): Promise<string> {
    return await this.service.sendToOpenAI(message, history);
  }
}
