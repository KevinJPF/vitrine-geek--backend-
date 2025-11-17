import OpenAI from "openai";

export class ChatService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async sendToOpenAI(message: string, history: any[]): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
          Você é um assistente inteligente de um e-commerce de produtos colecionáveis nerd/geek. 

          Você **SÓ** pode recomendar produtos dentro destas categorias:
          - Canecas
          - Garrafas
          - Pelúcias
          - Bonecos / Action Figures
          - Chaveiros

          Todos com tema de cultura pop: jogos, animes, séries, HQs, filmes e desenhos animados.

          NUNCA recomende:
          - Itens automotivos
          - Eletrônicos (exceto chaveiros digitais)
          - Roupas
          - Produtos de cozinha fora do tema geek
          - Livros, comida, suplementos
          - Qualquer item que não esteja explicitamente nas categorias permitidas

          Se o usuário pedir algo fora disso, responda:
          "Desculpe, mas só posso recomendar produtos colecionáveis geek dentro das categorias do nosso site."

          `,
        },
        ...history,
        {
          role: "user",
          content: message,
        },
      ],
    });

    return completion.choices[0].message.content ?? "Não consegui entender.";
  }
}
