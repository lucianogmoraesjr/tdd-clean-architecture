export interface AuthenticationDTO {
  email: string;
  password: string;
}

export interface Authentication {
  execute(data: AuthenticationDTO): Promise<string | null>;
}
