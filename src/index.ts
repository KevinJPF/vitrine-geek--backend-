import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import clienteRoutes from "./routes/clienteRoutes";
import cartaoRoutes from "./routes/cartaoRoutes";
import enderecoRoutes from "./routes/enderecoRoutes";
import produtoRoutes from "./routes/produtoRoutes";
import carrinhoRoutes from "./routes/carrinhoRoutes";
import pedidosRoutes from "./routes/pedidosRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Liberar todas as origens (para dev)
app.use(cors());

console.log("Iniciando o servidor...");

// #region Rotas
app.use("/clientes", clienteRoutes);
app.use("/cartoes", cartaoRoutes);
app.use("/enderecos", enderecoRoutes);
app.use("/produtos", produtoRoutes);
app.use("/carrinhos", carrinhoRoutes);
app.use("/pedidos", pedidosRoutes);
// #endregion

// Rota padrão
app.get("/", (req: Request, res: Response) => {
  res.send("API rodando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
