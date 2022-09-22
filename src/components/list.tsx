type ListProps = {
  items: string[]
}

function List({ items }: ListProps) {
  return (
    <div className='p-2'>
      <ul>
        {items?.map((item, idx) => (
          <li
            key={idx}
            className='p-2 cursor-pointer hover:bg-blue rounded-md font-semibold'
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default List
