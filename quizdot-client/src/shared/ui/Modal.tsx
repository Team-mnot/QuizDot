/* eslint-disable prettier/prettier */
import { Button } from './index';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function Modal(props: ModalProps) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="p-2 bg-white border-2 rounded-md shadow-md">
        <div className="flex justify-end">
          <Button className="" onClick={props.onClose} label="X" />
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}
