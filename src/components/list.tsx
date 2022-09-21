import * as React from 'react'

type ListProps = {
  items: string[]
}

function List({ items }: ListProps) {
  return (
    <div className='p-2 w-full h-full '>
      <ul>
        {items?.map((item, idx) => (
          <li key={idx} className='p-2'>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default List
