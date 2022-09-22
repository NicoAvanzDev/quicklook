import { RefObject, useCallback, useLayoutEffect, useState } from 'react'

export interface ResizeObserverEntry {
  target: HTMLElement
  contentRect: DOMRectReadOnly
}

export function useResizeObserver(
  ref: RefObject<HTMLElement>,
  callback?: (entry: DOMRectReadOnly) => void
) {
  const [width, setWidth] = useState<number>()
  const [height, setHeight] = useState<number>()

  const handleResize = useCallback<any>(
    (entries: ResizeObserverEntry[]) => {
      if (!Array.isArray(entries)) {
        return
      }

      const entry = entries[0]
      setWidth(entry.contentRect.width)
      setHeight(entry.contentRect.height)

      if (callback) {
        callback(entry.contentRect)
      }
    },
    [callback]
  )

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    let RO = new ResizeObserver(entries => handleResize(entries))
    RO.observe(ref.current)

    return () => {
      RO.disconnect()
    }
  }, [ref])

  return [width, height]
}
