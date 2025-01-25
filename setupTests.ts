import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import failOnConsole from "vitest-fail-on-console";

failOnConsole();

vi.mock("src/api/data/utils/getContentPath");
