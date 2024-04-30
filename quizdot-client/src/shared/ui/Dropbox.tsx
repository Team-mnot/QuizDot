import { useState } from 'react';

interface DropboxProps {
  options: string[];
  item: string;
  onClick: (newitem: string) => void;
}

export function Dropbox(props: DropboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(props.item);

  const handleClickItem = (e: React.MouseEvent<HTMLDivElement>) => {
    setItem(e.currentTarget.id);
    setIsOpen(false);
    props.onClick(e.currentTarget.id);
  };

  return (
    <div className={'relative inline-block'}>
      <div
        className={
          'flex h-auto w-64 justify-between rounded-md border-2 bg-white p-5 shadow-md'
        }
        onClick={() => setIsOpen(true)}
      >
        <p>{item}</p>
        <p>{isOpen ? '▲' : '▼'}</p>
      </div>
      {isOpen && (
        <div className={'absolute top-full h-auto w-64 rounded-md bg-white'}>
          {props.options.map((i, index) => (
            <div
              id={i}
              className={
                'white-space-nowrap cursor-pointer rounded-md p-5 hover:bg-gray-100'
              }
              key={index}
              onClick={handleClickItem}
            >
              {i}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
