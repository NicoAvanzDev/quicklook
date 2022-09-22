import * as React from 'react'
import { InputChangeEvent } from '../utils/types'

type InputProps = {
  placeholder?: string
  onChange?: (e: InputChangeEvent) => void
}

function Input({ onChange, placeholder }: InputProps) {
  const handleChange = (e: InputChangeEvent) => {
    onChange && onChange(e)
  }
  return (
    <input
      type='text'
      className='p-2 w-full h-full bg-midnight border rounded-md font-semibold focus:ring-blue-500 focus:border-blue outline-none'
      placeholder={placeholder}
      autoFocus
      onChange={handleChange}
    />
  )
}

export default Input
