import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from './baseApi';

export const LogOutApi = async (): Promise<boolean> => {
  try {
    const response = await jwtAxiosInstance.get(`${baseApi}/member/logout`);
    if (response.status === 200) {
      window.alert('로그아웃 되었습니다');
      return true;
    }
  } catch (error) {
    window.alert('서버 오류입니다');
    console.log(error);
    return false;
  }
  return false;
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
