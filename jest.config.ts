import nextJest from "next/jest";
import type { JestConfig } from '@jest/types/build/Config';
import type { Config } from '@types/jest';


export const createJestConfig: JestConfig = nextJest({
  ...({ testEnvironment: "node" } as any),
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  clearMocks: true,
});