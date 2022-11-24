export interface UpdateAccessTokenRepository {
  execute(id: string, token: string): Promise<void>;
}
