// src/pages/survival/api/api.ts
// import { iCharacter } from '@/shared/ui/Character';
import { PlayerInSurvivalMode, iQuizList } from './types';
import { dummyCharacters } from './dummyCharacters';
import axios from 'axios';
import { baseApi } from '@/shared/apis';

export function getPlayerData(): PlayerInSurvivalMode[] {
  return dummyCharacters as PlayerInSurvivalMode[];
}

// const url = 'survival';

export async function fetchQuizData(
  roomId: number,
  category: string,
  count: number,
): Promise<iQuizList> {
  const apiUrl = `${baseApi}/game/quiz/${roomId}?category=${category}&count=${count}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.status !== 200) {
      throw new Error('네트워크 응답이 올바르지 않습니다');
    }

    return response.data;
  } catch (error) {
    throw new Error('네트워크 요청 중 오류가 발생했습니다');
  }
}

export async function postQuizResult(
  roomId: number,
  isCorrect: boolean,
): Promise<void> {
  const result = isCorrect ? 1 : -1;
  const apiUrl = `${baseApi}/survival/score/${roomId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ result }),
    });
    if (!response.ok) {
      throw new Error('Failed to post quiz result');
    }
    const data = await response.json();
    console.log('Result posted successfully:', data);
  } catch (error) {
    console.error('Error posting result:', error);
  }
}
