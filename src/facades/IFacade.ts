export interface IFacade<T> {
  // Métodos abstratos que devem ser implementados pelas subclasses
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(entity: T): Promise<{ [key: string]: any }>;
  update(
    id: number,
    entity: T,
    actualEntity?: T
  ): Promise<{ [key: string]: any }>;
  delete(id: number): Promise<boolean>;
}
