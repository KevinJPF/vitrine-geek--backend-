import { IEntidade } from "../models/IEntidade";

export interface IFacade<T extends IEntidade> {
  // Métodos abstratos que devem ser implementados pelas subclasses
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: number, entity: T): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
