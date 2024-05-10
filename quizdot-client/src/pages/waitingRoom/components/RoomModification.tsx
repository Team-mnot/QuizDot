import { Button, Dropbox, Input, Toast } from '@/shared/ui';
import { useEffect, useState } from 'react';
import { RoomInfoDto } from '@/pages/lobby/api/types';
import { ModifyRoomApi } from '../api/api';
import {
  categoryList,
  maxPeopleList,
  maxQuestionList,
  modeList,
  openList,
} from '@/pages/lobby/constants';
import { ModifyingRoomInfo } from '../api/types';

export function RoomModification(props: {
  channelId: number;
  roomInfo: RoomInfoDto;
}) {
  const [title, setTitle] = useState<string>(props.roomInfo.title);
  const [open, setOpen] = useState<number>(props.roomInfo.open ? 1 : 0);
  const [password, setPassword] = useState<string>(props.roomInfo.password);
  const [mode, setMode] = useState<string>(props.roomInfo.gameMode);
  const [maxPeople, setMaxPeople] = useState<number>(props.roomInfo.maxPeople);
  const [category, setCategory] = useState<string>(props.roomInfo.category);
  const [maxQuestion, setMaxQuestion] = useState<number>(
    props.roomInfo.maxQuestion,
  );

  const [toastState, setToastState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    if (mode === 'SURVIVAL') {
      setMaxPeople(18);
    } else if (mode === 'ONETOONE') {
      setMaxPeople(2);
    } else if (mode === 'NORMAL') {
      setMaxPeople(8);
    }
  }, [mode]);

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const selectedOpen = (key: number) => {
    setOpen(key);
  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const selectedMode = (key: string) => {
    setMode(key);
  };

  const selectedMaxPeople = (key: number) => {
    setMaxPeople(key);
  };

  const selectedCategory = (key: string) => {
    setCategory(key);
  };

  const selectedMaxQuestion = (key: number) => {
    setMaxQuestion(key);
  };

  const modifyRoom = async () => {
    const modifyingRoomInfo: ModifyingRoomInfo = {
      title: title,
      open: open ? true : false,
      password: password,
      mode: mode,
      category: category,
      maxPeople: maxPeople,
      maxQuestion: maxQuestion,
    };

    const response = await ModifyRoomApi(props.channelId, modifyingRoomInfo);

    if (response == 201) {
      setToastMessage('방 정보를 변경했습니다.');
      setToastState(true);
    } else {
      setToastMessage('방 정보를 변경하지 못했습니다.');
      setToastState(true);
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
            initial={open}
            options={openList}
            selectedKey={selectedOpen}
          />
        </div>
        {!open ? (
          <div>
            <p className={'p-2'}>비밀번호</p>
            <Input
              type="password"
              className="w-[130px]"
              value={password}
              onChange={changePassword}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className={'flex justify-between px-20 py-2'}>
        <div>
          <p className={'p-2'}>게임 모드</p>
          <Dropbox
            size="w-[200px]"
            initial={mode}
            options={modeList}
            selectedKey={selectedMode}
          />
        </div>
        <div>
          <p className={'p-2'}>인원 수</p>
          {mode === 'NORMAL' ? (
            <Dropbox
              size="w-[100px]"
              initial={maxPeople}
              options={maxPeopleList}
              selectedKey={selectedMaxPeople}
            />
          ) : (
            <Input
              type="text"
              className="w-[100px]"
              value={maxPeople}
              readOnly
            />
          )}
        </div>
      </div>
      <div className={'flex justify-between px-20 py-2'}>
        <div>
          <p className={'p-2'}>문제 카테고리</p>
          <Dropbox
            size="w-[200px]"
            initial={category}
            options={categoryList}
            selectedKey={selectedCategory}
          />
        </div>
        <div>
          <p className={'px-5 py-2'}>문제 수</p>
          <Dropbox
            size="w-[100px]"
            initial={maxQuestion}
            options={maxQuestionList}
            selectedKey={selectedMaxQuestion}
          />
        </div>
      </div>
      <div className={'px-20 py-10'}>
        <Button
          className={'w-full'}
          value="방 정보 변경"
          onClick={modifyRoom}
        />
      </div>
      {toastState === true ? (
        <Toast message={toastMessage} setToastState={setToastState} />
      ) : null}
    </div>
  );
}
