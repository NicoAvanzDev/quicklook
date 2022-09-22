export {}

declare global {
  interface Window {
    api: {
      search: (query: string) => string[]
      resize: (height: number) => void
    }
  }
}
