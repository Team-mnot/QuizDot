import { Button, Dropbox, Input } from '@/shared/ui';
import { useState } from 'react';
import { CreatingRoomInfo } from '../api/types';
import { createRoomApi } from '../api/api';
import { Toast } from '@/shared/ui/Toast';
import { useRouter } from '@/shared/hooks';

const statusList = ['공개', '비공개'];
const statusDBList = [true, false];
const modeList = ['일반 모드', '서바이벌 모드', '일대일 모드'];
const modeDBList = ['multi', 'survival', 'onetoone'];
const maxPeopleList = [8, 7, 6, 5, 4, 3, 2, 1];
const categoryList = ['랜덤', '상식', '역사', '문화', '한국어'];
const categoryDBList = [
  'random',
  'common sense',
  'history',
  'culture',
  'korean',
];
const maxQuestionList = [30, 20, 10];

interface RoomCreationProps {
  channelId: number;
}

export function RoomCreation(props: RoomCreationProps) {
  const [title, setTitle] = useState<string>('덤벼라');
  const [status, setStatus] = useState<number>(0);
  const [password, setPassword] = useState<string>('');
  const [mode, setMode] = useState<number>(0);
  const [maxPeople, setMaxPeople] = useState<number>(0);
  const [category, setCategory] = useState<number>(0);
  const [maxQuestion, setMaxQuestion] = useState<number>(0);

  const [toastState, setToastState] = useState(false);

  const router = useRouter();

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const selectedStatus = (index: number) => {
    setStatus(index);
  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const selectedMode = (index: number) => {
    setMode(index);
  };

  const selectedMaxPeople = (index: number) => {
    setMaxPeople(index);
  };

  const selectedCategory = (index: number) => {
    setCategory(index);
  };

  const selectedMaxQuestion = (index: number) => {
    setMaxQuestion(index);
  };

  const createTheRoom = async () => {
    const creatingRoomInfo: CreatingRoomInfo = {
      title: title,
      public: statusDBList[status],
      password: password,
      mode: modeDBList[mode],
      maxPeople: maxPeopleList[maxPeople],
      category: categoryDBList[category],
      maxQuestion: maxQuestionList[maxQuestion],
    };

    const response = await createRoomApi(props.channelId, creatingRoomInfo);

    if (response.status != 201) {
      setToastState(true);
    } else {
      router.routeTo(`/${props.channelId}/${mode}`);
    }
  };

  return (
    <div>
      <div className={'px-20 py-2'}>
        <p className={'p-2'}>방 제목</p>
        <Input
          type="text"
          className={'w-[350px]'}
          value={title}
          onChange={changeTitle}
        />
      </div>
      <div className={'flex justify-between px-20 py-2'}>
        <div>
          <p className={'p-2'}>공개 여부</p>
          <Dropbox
            size="w-[150px]"
            item={statusList[status]}
            options={statusList}
            selectedItem={selectedStatus}
          />
        </div>
        {status && (
          <div>
            <p className={'p-2'}>비밀번호</p>
            <Input
              type="password"
              className="w-[130px]"
              value={password}
              onChange={changePassword}
            />
          </div>
        )}
      </div>
      <div className={'flex justify-between px-20 py-2'}>
        <div>
          <p className={'p-2'}>게임 모드</p>
          <Dropbox
            size="w-[200px]"
            item={modeList[mode]}
            options={modeList}
            selectedItem={selectedMode}
          />
        </div>
        <div>
          <p className={'p-2'}>인원 수</p>
          <Dropbox
            size="w-[100px]"
            item={maxPeopleList[maxPeople]}
            options={maxPeopleList}
            selectedItem={selectedMaxPeople}
          />
        </div>
      </div>
      <div className={'flex justify-between px-20 py-2'}>
        <div>
          <p className={'p-2'}>문제 카테고리</p>
          <Dropbox
            size="w-[200px]"
            item={categoryList[category]}
            options={categoryList}
            selectedItem={selectedCategory}
          />
        </div>
        <div>
          <p className={'px-5 py-2'}>문제 수</p>
          <Dropbox
            size="w-[100px]"
            item={maxQuestionList[maxQuestion]}
            options={maxQuestionList}
            selectedItem={selectedMaxQuestion}
          />
        </div>
      </div>
      <div className={'px-20 py-10'}>
        <Button className={'w-full'} value="방 생성" onClick={createTheRoom} />
      </div>

      {toastState === true ? (
        <Toast
          message={'방을 생성하지 못했습니다.'}
          setToastState={setToastState}
        />
      ) : null}
    </div>
  );
}
