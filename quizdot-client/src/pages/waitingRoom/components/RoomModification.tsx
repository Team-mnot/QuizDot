import { Button, Dropbox, Input, Toast } from '@/shared/ui';
import { useEffect, useState } from 'react';
import { RoomInfoType } from '@/pages/lobby/api/types';
import { modifyRoomApi } from '../api/api';
import {
  categoryList,
  maxPeopleList,
  maxQuestionList,
  modeList,
  openList,
} from '@/pages/lobby/constants';
import { ModifyingRoomType } from '../api/types';

export function RoomModification({ roomInfo }: { roomInfo: RoomInfoType }) {
  const [title, setTitle] = useState<string>(roomInfo.title);
  const [open, setOpen] = useState<number>(roomInfo.open ? 1 : 0);
  const [password, setPassword] = useState<string>(roomInfo.password);
  const [mode, setMode] = useState<string>(roomInfo.gameMode);
  const [maxPeople, setMaxPeople] = useState<number>(
    roomInfo.gameMode == 'NORMAL' ? roomInfo.maxPeople : 8,
  );
  const [fixedMaxPeople, setFixedMaxPeople] = useState<number>(
    roomInfo.gameMode == 'NORMAL' ? 0 : roomInfo.maxPeople,
  );
  const [category, setCategory] = useState<string>(roomInfo.category);
  const [maxQuestion, setMaxQuestion] = useState<number>(roomInfo.maxQuestion);

  const [toastState, setToastState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    if (mode === 'SURVIVAL') {
      setFixedMaxPeople(18);
    } else if (mode === 'ONETOONE') {
      setFixedMaxPeople(2);
    }
  }, [mode, open]);

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

  const handleModifyRoom = async () => {
    const modifyingRoomInfo: ModifyingRoomType = {
      title: title,
      open: open ? true : false,
      password: open ? '' : password,
      mode: mode,
      category: category,
      maxPeople: mode == 'NORMAL' ? maxPeople : fixedMaxPeople,
      maxQuestion: mode == 'NORMAL' ? maxQuestion : 0,
    };

    console.log(modifyingRoomInfo);
    const response = await modifyRoomApi(roomInfo.roomId, modifyingRoomInfo);

    if (response == 200) {
      setToastMessage('방 정보를 변경했습니다.');
      setToastState(true);
    } else {
      setToastMessage('방 정보를 변경하지 못했습니다.');
      setToastState(true);
    }
  };

  return (
    <div className="h-[550px] w-[500px]">
      <div className="px-[30px] py-[10px]">
        <p className="p-[10px]">방 제목</p>
        <Input
          type="text"
          className="w-full"
          value={title}
          onChange={changeTitle}
        />
      </div>
      <div className="flex justify-between">
        <div className="px-[30px] py-[10px]">
          <p className="p-[10px]">공개 여부</p>
          <Dropbox
            size="w-[150px]"
            initial={open}
            options={openList}
            selectedKey={selectedOpen}
          />
        </div>
        {open == 0 ? (
          <div className="px-[30px] py-[10px]">
            <p className="p-[10px]">비밀번호</p>
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
      <div className="flex justify-between">
        <div className="px-[30px] py-[10px]">
          <p className="p-[10px]">게임 모드</p>
          <Dropbox
            size="w-[200px]"
            initial={mode}
            options={modeList}
            selectedKey={selectedMode}
          />
        </div>
        <div className="px-[30px] py-[10px]">
          <p className="p-[10px]">인원 수</p>

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
              value={fixedMaxPeople}
              readOnly
            />
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="px-[30px] py-[10px]">
          <p className="p-[10px]">문제 카테고리</p>
          <Dropbox
            size="w-[200px]"
            initial={category}
            options={categoryList}
            selectedKey={selectedCategory}
          />
        </div>
        {mode === 'NORMAL' && (
          <div className="px-[30px] py-[10px]">
            <p className="p-[10px]">문제 수</p>
            <Dropbox
              size="w-[100px]"
              initial={maxQuestion}
              options={maxQuestionList}
              selectedKey={selectedMaxQuestion}
            />
          </div>
        )}
      </div>

      <div className="p-[30px]">
        <Button
          className="w-full"
          value="방 정보 변경"
          onClick={handleModifyRoom}
        />
      </div>

      {toastState === true ? (
        <Toast message={toastMessage} setToastState={setToastState} />
      ) : null}
    </div>
  );
}
