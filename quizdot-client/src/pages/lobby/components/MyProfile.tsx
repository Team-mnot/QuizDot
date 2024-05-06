import { useOpenModal } from '@/shared/hooks';
import { Modal, Progress } from '@/shared/ui';

export function MyProfile() {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();

  return (
    <div>
      <div onClick={clickModal}>
        <div className={'rounded-lg border-2 bg-white p-5 shadow-md'}>
          <div className={'flex'}>
            <div className={'rounded-lg border-2 bg-white p-2 shadow-md'}>
              <img
                src="/images/ikball.png"
                alt=""
                className="h-[100px] w-[100px]"
              />
            </div>
            <div className={'h-auto w-[200px] px-5'}>
              <div
                className={'rounded-lg border-2 bg-white text-center shadow-md'}
              >
                끝내주는
              </div>
              <div className={'p-2'}>Lv.18 안아줘요</div>
              <div className={'flex p-2'}>
                <img
                  src="/images/ikball.png"
                  alt=""
                  className="h-[23px] w-[23px]"
                />
                <div className="pl-2">100</div>
              </div>
            </div>
          </div>
          <div>
            <Progress
              size="w-[300px]"
              color="yellow"
              label="50000/100000"
              currentValue={50000}
              maxValue={100000}
              padding="pt-5"
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isOpenModal} onClose={closeModal}>
        <div>마이페이지</div>
      </Modal>
    </div>
  );
}
