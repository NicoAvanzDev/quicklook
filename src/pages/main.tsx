import { useState } from 'react'
import List from '../components/list'
import Input from '../components/input'
import { InputChangeEvent } from '../utils/types'

function Main() {
  const [searchResult, setSearchResult] = useState([] as string[])

  const handleSearch = (e: InputChangeEvent) => {
    const result = ['test1', 'test2', 'test3']
    setSearchResult(result)
  }

  return (
    <div className='overflow-hidden'>
      <div className='p-2 w-full h-[60px] bg-midnight rounded-md'>
        <Input placeholder='Search...' onChange={handleSearch} />
      </div>
      {searchResult && (
        <div className='mt-2 p-2 w-full h-full bg-midnight rounded-md '>
          <List items={searchResult} />
        </div>
      )}
    </div>
  )
}

export default Main
