// import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { baseApi } from '@/shared/apis';
import type { FindPwdProps, Response } from './types';

export async function FindPwdApi(props: FindPwdProps): Promise<void> {
  // const navi = useNavigate();

  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member`,
      props,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status === 200) {
      console.log('비밀번호 찾기 성공');
      window.alert('비밀번호 찾기 성공');
      // Todo : 보안문제나 뭐 그런 것
      // navi('/reset-pwd');
    }
  } catch (error) {
    console.error('Error Find Password', error);
  }
}
