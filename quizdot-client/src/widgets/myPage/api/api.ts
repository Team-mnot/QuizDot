import axios, { AxiosResponse } from 'axios';
import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import axiosInstance from '@/shared/utils/axiosInstance';
import { AxiosError } from 'axios';
import { baseApi } from '@/shared/apis';
import type { Response, UserInfo, ChangePwdProps } from './types';

// 유저 정보 조회 api
export async function GetUserInfoApi(props: number): Promise<UserInfo | null> {
  try {
    const response = await axiosInstance.get(
      `${baseApi}/member/info/${props}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
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

// 캐릭터 변경 api
export async function ChangeCharacterApi(props: number) {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/character/${props}`,
      props,
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
  localStorage.setItem('accessToken', accessToken!);
}

// 칭호 변경 api
export async function ChangeTitleApi(props: number) {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/title/${props}`,
      props,
      {
        headers: {
          'Content-Type': 'application/json',
          access: accessToken,
        },
      },
    );
    if (response.status === 200) {
      console.log('칭호 변경 성공');
    }
  } catch (error) {
    console.error('Error Change Title', error);
  }
  localStorage.setItem('accessToken', accessToken!);
}

// 닉네임 변경 api
export async function ChangeNicknameApi(props: string) {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/nickname`,
      {
        nickname: props,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          access: accessToken,
        },
      },
    );
    if (response.status === 200) {
      window.alert('닉네임이 변경되었습니다');
      // Todo : 유저 정보 다시 받거나, 그냥 스토어 것만 고치기
    }
  } catch (error) {
    console.error('Error Change Nickname', error);
  }
  localStorage.setItem('accessToken', accessToken!);
}

// 닉네임 체크 api
export async function userNicknameCheckApi(props: string): Promise<boolean> {
  try {
    const response = await jwtAxiosInstance.get(
      `${baseApi}/member/check-nickname?nickname=${props}`,
    );
    if (response.data.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error Id Check', error);
    return false;
  }
}

// 비밀번호 변경 api
export async function ChangePwdApi(props: ChangePwdProps) {
  try {
    const response = await jwtAxiosInstance.post(`${baseApi}/member/info/pwd`, {
      password: props.password,
      chkPassword: props.chkPassword,
    });
    if (response.status === 200) {
      window.alert('비밀번호가 변경되었습니다');
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      window.alert('비밀번호 변경에 실패했습니다');
    } else {
      console.error(error);
      window.alert('서버 오류입니다');
    }
  }
}

// 현재 비밀번호 확인 api
export async function CheckPwdApi(props: string): Promise<boolean> {
  try {
    const response = await jwtAxiosInstance.post(
      `${baseApi}/member/info/pwd-check`,
      {
        password: props,
      },
    );
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      window.alert('비밀번호가 일치하지 않습니다');
      return false;
    } else {
      console.error(error);
      window.alert('서버 오류입니다');
      return false;
    }
  }
  return false;
}

// 캐릭터 뽑기 api
export async function GetCharacterApi() {
  try {
    const response = await jwtAxiosInstance.post(
      `${baseApi}/member/reward/random-pick/character`,
    );
    if (response.status === 200) {
      console.log('캐릭터 뽑기 성공');
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      window.alert('포인트가 부족합니다');
    } else {
      console.error(error);
      window.alert('서버 오류입니다');
    }
  }
}

// 닉네임 색상 뽑기 api
export async function GetColerApi() {
  try {
    const response = await jwtAxiosInstance.post(
      `${baseApi}/member/reward/random-pick/color`,
    );
    if (response.status === 200) {
      console.log('닉네임 색상 뽑기 성공');
    }
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 400) {
      window.alert('포인트가 부족합니다');
    } else {
      console.error(error);
      window.alert('서버 오류입니다');
    }
  }
}
