import { Button } from './index';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function Modal(props: ModalProps) {
  const handleClose = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      // 모달 배경을 클릭한 경우에만 모달을 닫음
      props.onClose();
    }
  };

  if (!props.isOpen) return null;

  return (
    <div
      className={
        'fixed left-0 top-0 z-40 flex h-full w-full items-center justify-center bg-black bg-opacity-50'
      }
      onClick={handleClose}
    >
      <div className={'rounded-md border-2 bg-white p-5 shadow-md'}>
        <div className={'flex justify-end'}>
          <Button
            className="hover:border-transparent hover:bg-gray-200 focus:outline-none active:bg-gray-300"
            onClick={props.onClose}
            value="X"
          />
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
}
