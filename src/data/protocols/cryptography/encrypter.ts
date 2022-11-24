export interface Encrypter {
  execute(id: string): Promise<string>;
}
