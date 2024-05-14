// src/pages/survival/api/api.ts
// import { iCharacter } from '@/shared/ui/Character';
import { PlayerInSurvivalMode } from './types';
import { dummyCharacters } from './dummyCharacters';
import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';

export function getPlayerData(): PlayerInSurvivalMode[] {
  return dummyCharacters as PlayerInSurvivalMode[];
}

export async function postQuizResult(
  roomId: number,
  isCorrect: boolean,
): Promise<void> {
  const result = isCorrect ? 1 : -1;
  const apiUrl = `${baseApi}/survival/score/${roomId}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl, { result });
    console.log('Result posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting result:', error);
    throw new Error('Failed to post quiz result');
  }
}
