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
  console.log(data);
  return data;
}