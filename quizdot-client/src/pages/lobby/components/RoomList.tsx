import { Button, Modal } from '@/shared/ui';
import { Room } from './Room';
import { useOpenModal } from '@/shared/hooks';
import { RoomCreation } from './RoomCreation';

const dummyData = [
  {
    id: 1,
    title: '들어오지마요',
    category: '랜덤',
    mode: '일반 모드',
    maxQuestion: 10,
    maxPeople: 8,
    public: true,
    password: '',
  },
];

export function RoomList() {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();

  return (
    <div>
      <div>
        <Button value="전체" />
        <Button value="일반" />
        <Button value="서바이벌" />

        <Button value="이전" />
      </div>
      <div className={'rounded-lg bg-white bg-opacity-20 p-5 shadow-md'}>
        {dummyData.map((item, index) => (
          <Room
            onClick={() => alert('입장!')}
            key={index}
            id={item.id}
            category={item.category}
            maxPeople={item.maxPeople}
            maxQuestion={item.maxQuestion}
            mode={item.mode}
            password={item.password}
            public={item.public}
            title={item.title}
          />
        ))}
      </div>
      <div>
        <Button value="<" />
        <Button value=">" />
        <Button value="방 생성" onClick={clickModal} />
      </div>

      <Modal isOpen={isOpenModal} onClose={closeModal}>
        <RoomCreation />
      </Modal>
    </div>
  );
}
