import axios from 'axios';
// import { baseApi } from './baseApi';

// Todo: url /api 추가해주면 고치기
// refresh token은 브라우저에 계속 남아있는데 따로 지워야 하는지 체크

export const LogOutApi = async (): Promise<'success' | 'fail'> => {
  const accessToken = localStorage.getItem('accessToken');

  // const response = await axios.get(`${baseApi}/member/logout`, {
  const response = await axios.get(`https://k10d102.p.ssafy.io/member/logout`, {
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      access: accessToken,
    },
  });

  return response.status === 200 ? 'success' : 'fail';
};
