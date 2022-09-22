import { useRef, useState } from 'react'
import List from '../components/list'
import Input from '../components/input'
import { InputChangeEvent } from '../utils/types'
import { useResizeObserver } from '@/hooks/resize'

function Main() {
  const [searchResult, setSearchResult] = useState([] as string[])
  const mainEl = useRef(null)

  const handleResize = (entry: DOMRectReadOnly) => {
    window.api.resize(entry.height)
  }

  useResizeObserver(mainEl, handleResize)

  const handleSearch = (e: InputChangeEvent) => {
    const result = window.api.search(e.target.value)
    setSearchResult(result)
  }

  return (
    <div ref={mainEl} className='overflow-hidden bg-transparent'>
      <div className='p-2 w-full h-[60px] bg-midnight rounded-md'>
        <Input placeholder='Search...' onChange={handleSearch} />
      </div>
      {searchResult.length != 0 && (
        <div className='mt-2 p-2 w-full max-h-[500px] bg-midnight rounded-md overflow-y-scroll'>
          <List items={searchResult} />
        </div>
      )}
    </div>
  )
}

export default Main
