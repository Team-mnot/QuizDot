//src/pages/survival/components/CharacterComponent.tsx
// 그냥 캐릭터 껍데기 입니다 여따가 더미 데이터 넣어서 출력하께요
// 더미 넣어서 출력하는거 CharacterPreview.tsx

import { CharacterProps } from '../api/types';

export function CharacterComponent({
  imageUrl,
  title,
  nickname,
  score,
}: CharacterProps) { 
  return (
    <div className="flex w-36 flex-col items-center rounded-lg m-2 p-2" >
      <img
        src={imageUrl}
        alt={nickname}
        className="mb-2 h-20 w-20 rounded-full object-cover " // 이미지를 원형으로 만들고, object-cover로 이미지 비율 유지
      />
      <p className='text-xs font-bold rounded-lg border-black border-solid border-2 px-2 mb-1'>{title}</p>
      <p className='text-xs text-gray-700 rounded-lg border-black border-solid border-2 px-2 mb-1'>{nickname}</p>
      <div className='text-xs rounded-lg border-black border-solid border-2 px-2'>{score}</div>
    </div>
  );
}
