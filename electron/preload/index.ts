import { contextBridge } from 'electron'
import { FSCachedInstance } from '../services/fs-cached'

const fscached = FSCachedInstance.getInstance()

contextBridge.exposeInMainWorld('api', {
  search: (query: string): string[] => {
    return fscached.search(query.toLowerCase())
  },
  resize: (height: number): void => {
    window.resizeTo(400, height)
  }
})
