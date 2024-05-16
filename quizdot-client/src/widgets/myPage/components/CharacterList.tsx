import type { Character } from '../api/types';
import { ChangeCharacterApi } from '../api/api';

const handleClick = (props: number) => {
  ChangeCharacterApi(props);
};

export function CharacterList(chaInfo: {
  characterId: number;
  characterList: Character[];
}) {
  return (
    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 max-h-80 overflow-y-auto ">
      {chaInfo.characterList
        .sort((a, b) => a.id - b.id)
        .map((character, id) => (
          <div
            key={id}
            className="hover:border-transparent hover:bg-gray-200 focus:outline-none active:bg-gray-300"
            onClick={() => handleClick(character.id)}
          >
            <p>
              No {character.id} : {character.name}
            </p>
          </div>
        ))}
    </div>
  );
}
