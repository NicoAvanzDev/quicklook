const fs = require('fs')
const path = require('path')

class FileSystemCached {
  private static instance: FileSystemCached

  private cache: Map<string, string> = new Map()
  private path: string[] = []

  private includeExt = ['.exe', '.cmd']

  private constructor() {
    this.initialize()
  }

  static getInstance(): FileSystemCached {
    if (!FileSystemCached.instance) {
      FileSystemCached.instance = new FileSystemCached()
    }
    return FileSystemCached.instance
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

  open(file: string) {
    const filePath = this.cache.get(file)
    if (filePath) {
      require('child_process').execFile(filePath)
    }
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

  private async buildCachedFS() {
    this.path.forEach(async dir => {
      try {
        let files = await fs.promises.readdir(dir)

        files.forEach((file: string) => {
          if (this.includeExt.includes(path.extname(file))) {
            this.cache.set(file, path.join(dir, file))
          }
        })
      } catch (ex) {
        console.debug(`Error reading directory ${dir}: ${ex}`)
      }
    })
  }
}

export { FileSystemCached }
