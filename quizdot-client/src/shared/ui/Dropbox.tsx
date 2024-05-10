import { useState } from 'react';

interface DropboxProps {
  size: string;
  initial: string | number;
  options: { [key: string | number]: string | number | boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedKey: (key: any) => void;
}

/*** 주의 : key 는 boolean 값을 가질 수 없음 ***/
export function Dropbox(props: DropboxProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | number | boolean>(
    props.options[props.initial],
  );

  const selectedItem = (
    key: string | number,
    value: string | number | boolean,
  ) => {
    props.selectedKey(key);
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div className={'relative inline-block'}>
      <div
        className={`flex h-auto ${props.size} justify-between rounded-md border-2 bg-white p-5 shadow-md hover:bg-gray-100`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>{selectedValue}</p>
        <p>{isOpen ? '▲' : '▼'}</p>
      </div>
      {isOpen && (
        <div
          className={`absolute top-full z-[2] h-auto ${props.size} rounded-md border-2 bg-white shadow-md`}
        >
          {Object.entries(props.options).map(([key, value]) => (
            <div
              className={
                'white-space-nowrap cursor-pointer rounded-md p-5 hover:bg-gray-100'
              }
              key={key}
              onClick={() => selectedItem(key, value)}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
