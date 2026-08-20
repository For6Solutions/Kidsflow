import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/kidsflow";
const isDevelopment = process.env.NODE_ENV !== "production";
const developmentConnectionString = isDevelopment
  ? (() => {
      const url = new URL(connectionString);
      url.searchParams.delete("sslmode");
      return url.toString();
    })()
  : connectionString;

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: developmentConnectionString,
      ssl: isDevelopment ? { rejectUnauthorized: false } : undefined,
    }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
