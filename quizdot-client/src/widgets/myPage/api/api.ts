import axios, { AxiosResponse } from 'axios';
import { baseApi } from '@/shared/apis';
import type { Response, UserInfo, ChangePwdProps } from './types';

export async function GetUserInfoApi(props: number): Promise<UserInfo | null> {
  try {
    const response: AxiosResponse<Response> = await axios.get(
      `${baseApi}/member/info/${props}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status === 200) {
      return response.data.data!;
    }
  } catch (error) {
    console.error('Error Get UserInfo', error);
  }
  return null;
}

export async function ChangeNicknameApi(props: string) {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/nickname`,
      props,
      {
        headers: {
          'Content-Type': 'application/json',
          access: accessToken,
        },
      },
    );
    if (response.status === 200) {
      console.log('닉네임 변경 성공');
      // Todo : 유저 정보 다시 받거나, 그냥 스토어 것만 고치기
    }
  } catch (error) {
    console.error('Error Change Nickname', error);
  }
}

export async function ChangeCharacterApi(props: number) {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/character/${props}`,
      {
        headers: {
          'Content-Type': 'application/json',
          access: accessToken,
        },
      },
    );
    if (response.status === 200) {
      console.log('캐릭터 변경 성공');
      // Todo : 유저 정보 다시 받거나, 그냥 스토어 것만 고치기
    }
  } catch (error) {
    console.error('Error Change Character', error);
  }
}

export async function ChangeTitleApi(props: number) {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/title/${props}`,
      {
        headers: {
          'Content-Type': 'application/json',
          access: accessToken,
        },
      },
    );
    if (response.status === 200) {
      console.log('칭호 변경 성공');
      // Todo : 유저 정보 다시 받거나, 그냥 스토어 것만 고치기
    }
  } catch (error) {
    console.error('Error Change Title', error);
  }
}

export async function ChangePwdApi(props: ChangePwdProps) {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/info/pwd`,
      props,
      {
        headers: {
          'Content-Type': 'application/json',
          access: accessToken,
        },
      },
    );
    if (response.status === 200) {
      console.log('비밀번호 변경 성공');
    }
  } catch (error) {
    console.error('Error Change Password', error);
  }
}
