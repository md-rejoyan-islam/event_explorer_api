import bcrypt from "bcryptjs";

/**
 * Hashes a plain text password.
 *
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Compares a plain text password with a hashed password.
 *
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to `true` if the passwords match, otherwise `false`.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
