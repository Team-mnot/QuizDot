import { useOpenModal } from '@/shared/hooks';
import { Modal } from '@/shared/ui';

export function MyProfile() {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();

  return (
    <div>
      <div
        className={'rounded-md border-2 bg-white p-5 shadow-md'}
        onClick={clickModal}
      >
        내정보임
      </div>

      <Modal isOpen={isOpenModal} onClose={closeModal}>
        <div>으악</div>
      </Modal>
    </div>
  );
}
