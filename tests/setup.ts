import "@testing-library/jest-dom";

// Polyfill crypto.randomUUID for jsdom
if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, "crypto", {
    value: {
      ...globalThis.crypto,
      randomUUID: () => {
        const hex = () => Math.floor(Math.random() * 16).toString(16);
        return `${Array.from({ length: 8 }, hex).join("")}-${Array.from({ length: 4 }, hex).join("")}-4${Array.from({ length: 3 }, hex).join("")}-${(8 + Math.floor(Math.random() * 4)).toString(16)}${Array.from({ length: 3 }, hex).join("")}-${Array.from({ length: 12 }, hex).join("")}`;
      },
    },
    writable: true,
  });
}
