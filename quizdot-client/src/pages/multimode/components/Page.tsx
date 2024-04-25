/* eslint-disable prettier/prettier */
import { useOpenModal } from '@/shared/hooks';
import { Button, Modal, Dropbox, Input, Progress } from '@/shared/ui';
import { Ballon } from '@/shared/ui/ballon';

export function MultiModePage() {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();

  const options = ['0', '1', '2', '3', '4'];

  const handleSelectedDropbox = () => {};

  const handleClick = () => {};

  return (
    <div>
      <div>
        <Ballon className="" message="야호"></Ballon>

        <Button className="" label="모달 열기" onClick={clickModal} />
        <Modal isOpen={isOpenModal} onClose={closeModal}>
          <div className="h-96 w-96">아오</div>
        </Modal>

        <Button className="" label="버튼" onClick={() => handleClick()} />

        <Dropbox options={options} onSelected={() => handleSelectedDropbox} />

        <Input className="" label="입력하세요" />

        <Progress
          className=""
          currentValue={'50.30'}
          maxValue={100}
          label={'50.30'}
        ></Progress>

        <Progress
          className=""
          currentValue={'50000'}
          maxValue={100000}
          label={'50000/100000'}
        ></Progress>
      </div>
    </div>
  );
}
