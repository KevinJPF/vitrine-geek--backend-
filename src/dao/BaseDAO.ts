import { DatabaseSingleton } from "../config/database";

// Classe base para todos os DAOs
export abstract class BaseDAO<T> {
  // Variável protegida para o pool de conexões
  protected db = DatabaseSingleton.getInstance().getPool();

  // Métodos abstratos que devem ser implementados pelas subclasses
  abstract getAll(): Promise<T[]>;
  abstract getById(id: number): Promise<T | null>;
  abstract create(entity: T): Promise<number>;
  abstract update(id: number, entity: T): Promise<boolean>;
  abstract delete(id: number): Promise<boolean>;
}
