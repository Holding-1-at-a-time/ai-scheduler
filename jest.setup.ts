import "@testing-library/jest-dom/extend-expect";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "jest-styled-components";
import "jest-axe/extend-expect";
import "jest-puppeteer/resources";
import "raf/polyfill";
import "intersection-observer";
import "whatwg-fetch";

configure({ adapter: new Adapter() });

interface SetupFile {
  path: string;
  setup?: () => void;
}

const setupFilesAfterEnv: SetupFile[] = [
  {
    path: "./src/setupTests.ts",
  },
  {
    path: "./src/mocks/browserMocks.ts",
  },
  {
    path: "./src/mocks/apiMocks.ts",
  },
  {
    path: "./src/mocks/storeMocks.ts",
  },
  {
    setup: (): void => {
      // Custom setup function
      // You can add any additional setup logic here
      // For example, you can mock global objects, set up test data, etc.
      console.log("Custom setup function");

      // Mock window.matchMedia
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(
          (query: string): MediaQueryList => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
          })
        ),
      });

      // Mock window.scrollTo
      Object.defineProperty(window, "scrollTo", {
        writable: true,
        value: jest.fn(),
      });

      // Mock window.getComputedStyle
      Object.defineProperty(window, "getComputedStyle", {
        writable: true,
        value: jest.fn(() => ({
          getPropertyValue: jest.fn(),
        })),
      });
    },
  },
];

export default {
  // ... other Jest configuration options ...
  setupFilesAfterEnv: setupFilesAfterEnv.map((file) => file.path),
} as const;
