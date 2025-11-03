import nextJest from "next/jest";
import { config as dotenvConfig } from "dotenv";
import { join } from "path";

dotenvConfig({ path: join(process.cwd(), ".env.test") }); // carrega o ambiente de teste

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(customJestConfig);
