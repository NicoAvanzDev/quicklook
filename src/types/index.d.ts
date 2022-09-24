export {}

declare global {
  interface Window {
    api: {
      search: (query: string) => string[]
      open: (file: string) => void
      resize: (height: number) => void
    }
  }
}
