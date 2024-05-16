import type { Character } from '../api/types';
import { ChangeCharacterApi } from '../api/api';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import '../css/index.css';

export function CharacterList(chaInfo: {
  characterId: number;
  characterList: Character[];
}) {
  const store = useUserStore();

  const handleClick = async (props: number) => {
    const id = await ChangeCharacterApi(props);
    if (id) {
      store.setCharacterId(id);
    }
  };

  return (
    <div
      className="custom-scrollbar flex flex-wrap overflow-y-auto border p-2 shadow-md"
      style={{ height: '333px' }}
    >
      {chaInfo.characterList
        .sort((a, b) => a.id - b.id)
        .map((character, id) => (
          <div key={id} className="flex w-1/4 flex-col items-center p-2">
            <div
              className="mt-2 rounded-lg border-2 bg-white p-2 shadow-md hover:border-transparent hover:bg-gray-200 focus:outline-none active:bg-gray-300"
              style={{
                width: '100px',
                height: '100px',
                backgroundColor: 'black',
              }}
              onClick={() => handleClick(character.id)}
            ></div>
            <span>
              No {character.id} : {character.name}
            </span>
          </div>
        ))}
    </div>
  );
}
