import axios from 'axios';
import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from './baseApi';

// Check: refresh token은 브라우저에 계속 남아있는데 따로 지워야 하는지 체크

export const LogOutApi = async (): Promise<'success' | 'fail'> => {
  const accessToken = localStorage.getItem('accessToken');

  const response = await axios.get(`${baseApi}/member/logout`, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      access: accessToken,
    },
  });
  return response.status === 200 ? 'success' : 'fail';
};

export async function WithdrawalApi(): Promise<boolean> {
  try {
    const response = await jwtAxiosInstance.delete(`${baseApi}/member`);
    if (response.status === 200) {
      window.alert('회원탈퇴가 완료되었습니다');
      return true;
    }
  } catch (error) {
    window.alert('서버 오류입니다');
    return false;
  }
  return false;
}
