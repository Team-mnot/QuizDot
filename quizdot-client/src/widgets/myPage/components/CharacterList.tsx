import type { Character } from '../api/types';

export function CharacterList(chaInfo: {
  characterId: number;
  characterList: Character[];
}) {
  console.log(chaInfo);
  return (
    <div>
      {chaInfo.characterId}
      {chaInfo.characterList?.map((character, index) => (
        <div key={index}>
          <p>Name: {character.id}</p>
        </div>
      ))}
    </div>
  );
}
