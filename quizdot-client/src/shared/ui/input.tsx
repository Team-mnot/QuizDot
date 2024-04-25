import { useState } from 'react';

interface InputProps {
  className: string;
  label: string;
}

export function Input(props: InputProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <input
      className={`rounded-md border-2 bg-white p-2 shadow-md ${props.className}`}
      type="text"
      placeholder={props.label}
      value={value}
      onChange={handleChange}
    />
  );
}
