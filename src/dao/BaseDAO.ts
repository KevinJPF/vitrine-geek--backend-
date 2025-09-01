import { DatabaseSingleton } from "../config/database";
import { BaseEntidade } from "../models/BaseEntidade";

// Classe base para todos os DAOs
export abstract class BaseDAO<T extends BaseEntidade> {
  // Variável protegida para o pool de conexões
  protected db = DatabaseSingleton.getInstance().getPool();

  // Métodos abstratos que devem ser implementados pelas subclasses
  abstract getAll(): Promise<T[]>;
  abstract getById(id: number): Promise<T | null>;
  abstract create(entity: T): Promise<T>;
  abstract update(id: number, entity: T): Promise<boolean>;
  abstract delete(id: number): Promise<boolean>;
}
