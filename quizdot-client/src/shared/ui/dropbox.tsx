/* eslint-disable prettier/prettier */
import { useState } from 'react';

interface DropboxProps {
  options: string[];
  onSelected: (selectedItem: string) => void;
}

export function Dropbox(props: DropboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (e: React.ChangeEvent<HTMLDivElement>) => {
    setSelectedItem(e.target.id);
    setIsOpen(false);
    props.onSelected(e.target.id);
  };

  return (
    <div className="relative inline-block">
      <div
        className="flex justify-between w-64 h-auto p-2 border-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>{selectedItem || 0}</div>
        <div>{isOpen ? '▲' : '▼'}</div>
      </div>
      {isOpen && (
        <div className="absolute w-64 h-auto bg-white rounded-md top-full">
          {props.options.map((item, index) => (
            <div
              id={item}
              className="p-2 rounded-md cursor-pointer white-space-nowrap hover:bg-gray-100"
              key={index}
              onClick={() => handleItemClick}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
