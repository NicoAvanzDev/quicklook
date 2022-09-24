type ListProps = {
  items: string[]
}

function List({ items }: ListProps) {
  const handleClick = (item: string) => {
    window.api.open(item)
  }

  return (
    <div className='p-2'>
      <ul>
        {items?.map((item, idx) => (
          <li
            key={idx}
            className='p-2 cursor-pointer hover:bg-blue rounded-md font-semibold'
            onClick={() => handleClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default List
