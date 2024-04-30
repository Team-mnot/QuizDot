import { Button } from './index';

interface AlertProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export function Alert(props: AlertProps) {
  if (!props.isOpen) return null;

  return (
    <div
      className={
        'h-30 fixed z-50 flex items-center justify-center rounded-md border-2 bg-white p-2 shadow-md'
      }
    >
      <div className="">
        <div className={'flex justify-end'}>
          <Button className="" onClick={props.onClose} value="X" />
        </div>
        <div className="">
          <div className={'font-bold'}>{props.message}</div>
          <div className="">{props.message}</div>
        </div>
      </div>
    </div>
  );
}
