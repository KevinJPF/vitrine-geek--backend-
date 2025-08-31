import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import clienteRoutes from './routes/clienteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Rotas
app.use('/clientes', clienteRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
