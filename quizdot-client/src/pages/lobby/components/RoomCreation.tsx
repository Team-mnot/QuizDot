import { Button, Dropbox, Input } from '@/shared/ui';
import { useState } from 'react';
import { RoomInfoProps } from '../api/types';

const statusList = ['공개', '비공개'];
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

export function RoomCreation() {
  const [title, setTitle] = useState<string>('덤벼라');
  const [status, setStatus] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [mode, setMode] = useState<string>('multi');
  const [maxPeople, setMaxPeople] = useState<number>(10);
  const [category, setCategory] = useState<string>('random');
  const [maxQuestion, setMaxQuestion] = useState<number>(1);

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const selectedStatus = (e: React.MouseEvent<HTMLDivElement>) => {
    switch (e.currentTarget.innerText) {
      case '공개':
        setStatus(true);
        break;
      default:
        setStatus(false);
    }
  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const selectedMode = (e: React.MouseEvent<HTMLDivElement>) => {
    switch (e.currentTarget.innerText) {
      case modeList[0]:
        setMode(modeDBList[0]);
        break;
      case modeList[1]:
        setMode(modeDBList[1]);
        break;
      default:
        setMode(modeDBList[2]);
    }
  };

  const selectedMaxPeoPle = (e: React.MouseEvent<HTMLDivElement>) => {
    setMaxPeople(Number(e.currentTarget.innerText));
  };

  const selectedCategory = (e: React.MouseEvent<HTMLDivElement>) => {
    switch (e.currentTarget.innerText) {
      case categoryList[0]:
        setCategory(categoryDBList[0]);
        break;
      case categoryList[1]:
        setCategory(categoryDBList[1]);
        break;
      case categoryList[2]:
        setCategory(categoryDBList[2]);
        break;
      case categoryList[3]:
        setCategory(categoryDBList[3]);
        break;
      default:
        setCategory(categoryDBList[4]);
    }
  };

  const selectedMaxQuestion = (e: React.MouseEvent<HTMLDivElement>) => {
    setMaxQuestion(Number(e.currentTarget.innerText));
  };

  const createTheRoom = async () => {
    const request: RoomInfoProps = {
      title: title,
      public: status,
      password: password,
      mode: mode,
      maxPeople: maxPeople,
      category: category,
      maxQuestion: maxQuestion,
    };

    console.log(request);
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
            item={statusList[0]}
            options={statusList}
            selectedItem={selectedStatus}
          />
        </div>
        {!status && (
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
            item={modeList[0]}
            options={modeList}
            selectedItem={selectedMode}
          />
        </div>
        <div>
          <p className={'p-2'}>인원 수</p>
          <Dropbox
            size="w-[100px]"
            item={maxPeopleList[0]}
            options={maxPeopleList}
            selectedItem={selectedMaxPeoPle}
          />
        </div>
      </div>
      <div className={'flex justify-between px-20 py-2'}>
        <div>
          <p className={'p-2'}>문제 카테고리</p>
          <Dropbox
            size="w-[200px]"
            item={categoryList[0]}
            options={categoryList}
            selectedItem={selectedCategory}
          />
        </div>
        <div>
          <p className={'px-5 py-2'}>문제 수</p>
          <Dropbox
            size="w-[100px]"
            item={maxQuestionList[0]}
            options={maxQuestionList}
            selectedItem={selectedMaxQuestion}
          />
        </div>
      </div>
      <div className={'px-20 py-10'}>
        <Button className={'w-full'} value="방 생성" onClick={createTheRoom} />
      </div>
    </div>
  );
}
