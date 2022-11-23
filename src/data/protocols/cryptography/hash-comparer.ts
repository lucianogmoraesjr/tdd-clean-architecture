export interface HashComparer {
  execute(value: string, hash: string): Promise<boolean>;
}
