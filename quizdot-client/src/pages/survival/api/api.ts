// src/pages/survival/api/api.ts
// import { iCharacter } from '@/shared/ui/Character';
import { iCharacter, iQuizList } from './types';
import { dummyCharacters } from './dummyCharacters';

export function getCharacterData(): iCharacter[] {
  const data = dummyCharacters;
  return data;
}

export async function fetchQuizData(
  roomId: number,
  category: string,
  count: number,
): Promise<iQuizList> {
  const apiUrl = `http://k10d102.p.ssafy.io/api/game/quiz/${roomId}?category=${category}&count=${count}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('네트워크 응답이 올바르지 않다네요');
  }

  const data = await response.json();
  2;
  console.log(data);
  return data;
}

export async function postQuizResult(
  roomId: number,
  isCorrect: boolean,
): Promise<void> {
  const result = isCorrect ? 1 : -1;
  const apiUrl = `http://k10d102.p.ssafy.io/api/survival/score/${roomId}`;
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
