import { Button } from './index';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function Modal(props: ModalProps) {
  if (!props.isOpen) return null;

  return (
    <div
      className={
        'fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black bg-opacity-50'
      }
    >
      <div className={'rounded-md border-2 bg-white p-5 shadow-md'}>
        <div className={'flex justify-end'}>
          <Button className="" onClick={props.onClose} value="X" />
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}
