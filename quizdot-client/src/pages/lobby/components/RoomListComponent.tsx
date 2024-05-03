import { Button } from '@/shared/ui';
import { RoomComponent } from './RoomComponent';

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

export function RoomListComponent() {
  return (
    <div>
      <div>
        <Button value="전체" />
        <Button value="일반" />
        <Button value="서바이벌" />
      </div>
      {dummyData.map((item, index) => (
        <RoomComponent
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
      <div>
        <Button value="<" />
        <Button value=">" />
        <Button value="방 생성" />
      </div>
    </div>
  );
}
