export interface IStrategy<T> {
  // Métodos abstratos que devem ser implementados pelas subclasses
  process(entity: T | T[]): Promise<boolean>;
}
