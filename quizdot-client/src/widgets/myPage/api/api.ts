import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import axiosInstance from '@/shared/utils/axiosInstance';
import { AxiosError } from 'axios';
import { baseApi } from '@/shared/apis';
import type { UserInfo, ChangePwdProps } from './types';

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
export async function ChangeCharacterApi(
  props: number,
): Promise<number | null> {
  try {
    const response = await jwtAxiosInstance.post(
      `${baseApi}/member/character/${props}`,
      props,
    );
    if (response.status === 200) {
      window.alert('캐릭터를 변경했습니다');
      return props as number;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 404) {
        window.alert('캐릭터가 존재하지 않습니다');
        return null;
      } else {
        console.error(error);
        window.alert('서버 오류입니다');
        return null;
      }
    } else {
      console.error(error);
      window.alert('알 수 없는 오류가 발생했습니다');
      return null;
    }
  }
  return null;
}

// 칭호 변경 api
export async function ChangeTitleApi(props: number): Promise<string | null> {
  try {
    const response = await jwtAxiosInstance.post(
      `${baseApi}/member/title/${props}`,
      props,
    );
    if (response.status === 200) {
      window.alert('칭호가 변경되었습니다');
      return response.data.data as string;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        window.alert('해금되지 않은 칭호입니다');
        return null;
      } else {
        console.error(error);
        window.alert('서버 오류입니다');
        return null;
      }
    } else {
      console.error(error);
      window.alert('알 수 없는 오류가 발생했습니다');
      return null;
    }
  }
  return null;
}

// 닉네임 변경 api
export async function ChangeNicknameApi(props: string): Promise<string | null> {
  try {
    const response = await jwtAxiosInstance.post(`${baseApi}/member/nickname`, {
      nickname: props,
    });
    if (response.status === 200) {
      window.alert('닉네임이 변경되었습니다');
      return props;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        window.alert('이미 존재하는 닉네임입니다');
        return null;
      } else {
        console.error(error);
        window.alert('서버 오류입니다');
        return null;
      }
    } else {
      console.error(error);
      window.alert('알 수 없는 오류가 발생했습니다');
      return null;
    }
  }
  return null;
}

// 닉네임 체크 api
export async function userNicknameCheckApi(props: string): Promise<boolean> {
  try {
    const response = await jwtAxiosInstance.get(
      `${baseApi}/member/check-nickname?nickname=${props}`,
    );
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        window.alert('이미 존재하는 닉네임입니다');
        return false;
      } else {
        console.error(error);
        window.alert('서버 오류입니다');
        return false;
      }
    } else {
      console.error(error);
      window.alert('알 수 없는 오류가 발생했습니다');
      return false;
    }
  }
  return false;
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
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        window.alert('비밀번호 변경에 실패했습니다');
      } else {
        console.error(error);
        window.alert('서버 오류입니다');
      }
    } else {
      console.error(error);
      window.alert('알 수 없는 오류가 발생했습니다');
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
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        window.alert('비밀번호가 일치하지 않습니다');
        return false;
      } else {
        console.error(error);
        window.alert('서버 오류입니다');
        return false;
      }
    } else {
      console.error(error);
      window.alert('알 수 없는 오류가 발생했습니다');
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
      return response.data.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        window.alert('포인트가 부족합니다');
      } else {
        console.error(error);
        window.alert('서버 오류입니다');
      }
    } else {
      console.error(error);
      window.alert('알 수 없는 오류가 발생했습니다');
    }
  }
}

// 닉네임 색상 뽑기 api
export async function GetColerApi(): Promise<string | null> {
  try {
    const response = await jwtAxiosInstance.post(
      `${baseApi}/member/reward/random-pick/color`,
    );
    if (response.status === 200) {
      return response.data.data;
    }
    return response.data.data as string;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response && error.response.status === 400) {
        window.alert('포인트가 부족합니다');
        return null;
      } else {
        console.error(error);
        window.alert('서버 오류입니다');
        return null;
      }
    } else {
      console.error(error);
      window.alert('알 수 없는 오류가 발생했습니다');
      return null;
    }
  }
}
