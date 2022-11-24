export interface Hasher {
  execute(value: string): Promise<string>;
}
