import { Button, Dropbox, Input, Toast } from '@/shared/ui';
import { useEffect, useState } from 'react';
import { CreatingRoomType } from '../api/types';
import { useRouter } from '@/shared/hooks';
import {
  categoryList,
  maxPeopleList,
  maxQuestionList,
  modeList,
  openList,
} from '../constants';
import { createRoomApi } from '../api/api';
import { enterRoomApi } from '@/pages/waitingRoom/api/api';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';

export function RoomCreation({ channelId }: { channelId: number }) {
  const [title, setTitle] = useState<string>('테스트');
  const [open, setOpen] = useState<number>(1);
  const [password, setPassword] = useState<string>('');
  const [mode, setMode] = useState<string>('NORMAL');
  const [maxPeople, setMaxPeople] = useState<number>(8);
  const [fixedMaxPeople, setFixedMaxPeople] = useState<number>(0);
  const [category, setCategory] = useState<string>('RANDOM');
  const [maxQuestion, setMaxQuestion] = useState<number>(10);

  const [toastState, setToastState] = useState<boolean>(false);
  const router = useRouter();
  const roomStore = useRoomStore();

  useEffect(() => {
    if (mode === 'SURVIVAL') {
      setFixedMaxPeople(18);
    } else if (mode === 'ILGITO') {
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

  const handleCreateRoom = async () => {
    const creatingRoom: CreatingRoomType = {
      title: title,
      open: open ? true : false,
      password: open ? '' : password,
      mode: mode,
      category: category,
      maxPeople: mode == 'NORMAL' ? maxPeople : fixedMaxPeople,
      maxQuestion: maxQuestion,
    };

    const response = await createRoomApi(channelId, creatingRoom);

    if (response.status == 201) {
      handleEnterRoom(channelId, response.data.roomId);
    } else {
      setToastState(true);
    }
  };

  const handleEnterRoom = async (_channelId: number, _roomId: number) => {
    const response = await enterRoomApi(_roomId);

    if (response.status == 200) {
      roomStore.fetchRoom(response.data.roomInfo);
      roomStore.fetchPlayers(response.data.players);
      router.routeTo(`/${_channelId}/${_roomId}/waiting`);
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
          className="w-full hover:border-transparent hover:bg-slate-200 focus:outline-none active:bg-slate-300"
          value="방 생성"
          onClick={handleCreateRoom}
        />
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
