import bcrypt from 'bcryptjs';

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, ROUNDS);
};

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
