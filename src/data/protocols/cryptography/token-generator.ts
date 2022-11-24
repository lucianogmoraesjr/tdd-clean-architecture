export interface TokenGenerator {
  execute(id: string): Promise<string>;
}
