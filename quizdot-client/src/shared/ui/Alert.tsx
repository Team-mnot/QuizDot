/* eslint-disable prettier/prettier */
import { Button } from './index';

interface AlertProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function Alert(props: AlertProps) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed z-50 flex items-center justify-center p-2 bg-white border-2 rounded-md shadow-md h-30">
      <div className="">
        <div className="flex justify-end">
          <Button className="" onClick={props.onClose} label="X" />
        </div>
        <div className="">
          <div className="font-bold">{props.message}</div>
          <div className="">{props.message}</div>
        </div>
      </div>
    </div>
  );
}
