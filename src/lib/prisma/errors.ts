import { Prisma } from "@prisma/client";

const CONNECTION_ERROR_CODES = new Set(["P1000", "P1001", "P1002", "P1008", "P1017"]);

export function isPrismaKnownRequestError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export function isPrismaUniqueViolation(error: unknown): boolean {
  return isPrismaKnownRequestError(error) && error.code === "P2002";
}

export function isPrismaForeignKeyViolation(error: unknown): boolean {
  return isPrismaKnownRequestError(error) && error.code === "P2003";
}

export function isPrismaNotFound(error: unknown): boolean {
  return isPrismaKnownRequestError(error) && error.code === "P2025";
}

export function isPrismaConnectionError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientRustPanicError) return true;
  return isPrismaKnownRequestError(error) && CONNECTION_ERROR_CODES.has(error.code);
}

export function getPrismaErrorCode(error: unknown): string | null {
  if (isPrismaKnownRequestError(error)) return error.code;
  if (error instanceof Prisma.PrismaClientInitializationError) return "P1001";
  if (error instanceof Prisma.PrismaClientRustPanicError) return "P1010";
  return null;
}
