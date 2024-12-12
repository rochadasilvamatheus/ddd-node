export default interface RepositoryInterface<T> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<void>;
  find(id: string): Promise<T>;
  findAll(): Promise<T[]>;
}
