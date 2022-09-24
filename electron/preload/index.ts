import { contextBridge } from 'electron'
import { FileSystemCached } from '../services/fs-cached'

const fscached = FileSystemCached.getInstance()

contextBridge.exposeInMainWorld('api', {
  search: (query: string): string[] => {
    return fscached.search(query.toLowerCase())
  },
  open: (file: string): void => {
    fscached.open(file)
  },
  resize: (height: number): void => {
    window.resizeTo(400, height)
  }
})
