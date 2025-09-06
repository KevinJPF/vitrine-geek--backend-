export interface IFacade<T> {
  // Métodos abstratos que devem ser implementados pelas subclasses
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(entity: T): Promise<string>;
  update(id: number, entity: T): Promise<string>;
  delete(id: number): Promise<boolean>;
}
