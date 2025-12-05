import { ChatService } from "../config/chatService";
import ProdutoFacade from "./ProdutoFacade";

export class ChatFacade {
  private service = new ChatService();

  async processMessage(message: string, history: any[]): Promise<string> {
    const allProducts = await ProdutoFacade.getInstance().getAll();
    console.log("Produtos disponíveis para recomendação:", allProducts);
    return await this.service.sendToOpenAI(
      message,
      history,
      this.mapProductsForAI(allProducts)
    );
  }

  private mapProductsForAI(products: any[]) {
    return products.map((p) => ({
      id: p.id,
      nome: p.nome_produto,
      descricao: p.descricao,
      categoria: "Boneco / Action Figure", // você pode mapear isso depois
      preco: Number(p.valor_venda),
      imagem: p.url_imagem,
      link: `http://localhost:5173/detalhes-produto/${p.id}`,
    }));
  }
}
