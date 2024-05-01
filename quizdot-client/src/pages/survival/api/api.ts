// src/pages/survival/api/api.ts
// import { iCharacter } from '@/shared/ui/Character';
import { iCharacter } from "./types"
import { dummyCharacters } from './dummyCharacters';

export function getCharacterData(): iCharacter[] {
  const data = dummyCharacters;
  return data;
};

