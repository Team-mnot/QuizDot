//src/shared/ui/CharacterComponent.tsx

export interface iCharacter {
  imageUrl: string;
  title: string;
  nickname: string;
  score?: number;
}

export function Character({ imageUrl, title, nickname, score }: iCharacter) {
  return (
    <div className="m-2 flex w-36 flex-col items-center rounded-lg p-2">
      <img
        src={imageUrl}
        alt={nickname}
        className="mb-2 h-20 w-20 rounded-full object-cover " // 이미지를 원형으로 만들고, object-cover로 이미지 비율 유지
      />
      <p className="mb-1 rounded-lg border-2 border-solid border-black bg-white bg-opacity-80 px-2 text-xs text-red-500">
        {title}
      </p>
      <p className="mb-1 rounded-lg border-2 border-solid border-black bg-white bg-opacity-80 px-2 text-xs font-bold">
        {nickname}
      </p>
      {score !== undefined && (
        <div className="rounded-lg border-2 border-solid border-black bg-white bg-opacity-80 px-2 text-xs">
          {score}
        </div>
      )}
    </div>
  );
}