import { useState } from 'react';

interface DropboxProps {
  size: string;
  item: string | number;
  options: string[] | number[];
  selectedItem: (index: number) => void;
}

export function Dropbox(props: DropboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(props.item);

  const selectedItem = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(false);
    setItem(e.currentTarget.innerText);
    props.selectedItem(Number(e.currentTarget.id));
  };

  return (
    <div className={'relative inline-block'}>
      <div
        className={`flex h-auto ${props.size} justify-between rounded-md border-2 bg-white p-5 shadow-md hover:bg-gray-100`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>{item}</p>
        <p>{isOpen ? '▲' : '▼'}</p>
      </div>
      {isOpen && (
        <div
          className={`absolute top-full z-[2] h-auto ${props.size} rounded-md border-2 bg-white shadow-md`}
        >
          {props.options.map((item, index) => (
            <div
              className={
                'white-space-nowrap cursor-pointer rounded-md p-5 hover:bg-gray-100'
              }
              key={item}
              id={String(index)}
              onClick={selectedItem}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
