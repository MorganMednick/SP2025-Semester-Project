import dotenv from "dotenv";

dotenv.config();

export const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in your environment variables.");
}
