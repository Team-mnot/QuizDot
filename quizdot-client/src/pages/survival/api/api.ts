// src/pages/survival/api/api.ts
import { CharacterData } from './types';

export const getCharacterData = async (): Promise<CharacterData[]> => {
  // Here you would have an API call to your backend to fetch character data
  // For now, let's return a dummy data
  return Promise.resolve([
    {
      photo: 'path_to_photo.png',
      title: 'Survivor',
      nickname: 'Braveheart',
      score: 1500,
    },
    // Add more characters as needed
  ]);
};
