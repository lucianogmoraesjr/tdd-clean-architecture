import bcrypt from 'bcrypt';
import { Hasher } from '../../data/protocols/cryptography/hasher';

export class BcryptAdapter implements Hasher {
  constructor(private salt: number) {}

  async execute(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt);
    return hashedValue;
  }
}
