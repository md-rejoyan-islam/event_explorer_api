import jwt, { JwtPayload, Secret } from "jsonwebtoken";

/**
 * Creates a JSON Web Token (JWT) for the given payload.
 *
 * @param payload - The data to include in the JWT.
 * @returns The signed JWT as a string.
 */
export function createJWT(payload: object): string {
  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

/**
 * Verifies a JSON Web Token (JWT).
 *
 * @param token - The JWT to verify.
 * @returns The decoded token payload.
 * @throws An error if the token is invalid or expired.
 */
export function verifyJWT(token: string): JwtPayload | string {
  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.verify(token, secret);
}
