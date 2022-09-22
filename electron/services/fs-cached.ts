const fs = require('fs')

class FileSystemCached {
  private cache: Map<string, string> = new Map()
  private path: string[] = []

  constructor() {
    this.initialize()
  }

  search(query: string): string[] {
    if (query.length === 0) {
      return []
    }

    const keys = Array.from(this.cache.keys())

    let result: string[] = []
    let key: string
    while ((key = keys.pop())) {
      if (key.toLowerCase().includes(query)) {
        result.push(key)
      }
    }

    return result.splice(0, 10)
  }

  private initialize() {
    this.path = this.getPathDirectories()
    this.buildCachedFS()
  }

  private getPathDirectories(): string[] {
    let path = ''
    if (process.platform === 'win32') {
      path = process.env.Path
    } else {
      path = process.env.PATH
    }
    return path.split(';')
  }

  private buildCachedFS() {
    this.path.forEach(dir => {
      try {
        let files = fs.readdirSync(dir)
        files.forEach((file: string) => {
          this.cache.set(file, dir)
        })
      } catch (ex) {
        console.debug(`Error reading directory ${dir}: ${ex}`)
      }
    })
  }
}

export class FSCachedInstance {
  private static instance: FileSystemCached

  public static getInstance(): FileSystemCached {
    if (!FSCachedInstance.instance) {
      FSCachedInstance.instance = new FileSystemCached()
    }
    return FSCachedInstance.instance
  }
}
