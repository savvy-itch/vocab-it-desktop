export {};

declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>;
    };
  }
}