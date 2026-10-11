import "server-only";
import { PrismaClient } from "@prisma/client";
const globalDb = globalThis as unknown as { tadhanaDb?: PrismaClient };
export const database = globalDb.tadhanaDb ?? new PrismaClient({ log: [] });
if (process.env.NODE_ENV !== "production") globalDb.tadhanaDb = database;
