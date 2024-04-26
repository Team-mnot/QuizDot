// src/pages/survival/components/CharacterPreview.tsx

import { CharacterWithPositionComponent } from './CharacterWithPositionComponent';

// 미리 지정된 위치 정보
const predefinedPositions = [
  { id: 'grid-item-1', position: { top: 60, left: 100 } },
  { id: 'grid-item-2', position: { top: 60, left: 240 } },
  { id: 'grid-item-3', position: { top: 60, left: 380 } },
  { id: 'grid-item-4', position: { top: 60, left: 520 } },
  { id: 'grid-item-5', position: { top: 60, left: 660 } },
  { id: 'grid-item-6', position: { top: 60, left: 800 } },
  { id: 'grid-item-7', position: { top: 60, left: 940 } },
  { id: 'grid-item-8', position: { top: 60, left: 1080 } },
  { id: 'grid-item-9', position: { top: 60, left: 1220 } },
  { id: 'grid-item-10', position: { top: 220, left: 100 } },
  { id: 'grid-item-11', position: { top: 220, left: 240 } },
  { id: 'grid-item-12', position: { top: 220, left: 380 } },
  { id: 'grid-item-13', position: { top: 220, left: 520 } },
  { id: 'grid-item-14', position: { top: 220, left: 660 } },
  { id: 'grid-item-15', position: { top: 220, left: 800 } },
  { id: 'grid-item-16', position: { top: 220, left: 940 } },
  { id: 'grid-item-17', position: { top: 220, left: 1080 } },
  { id: 'grid-item-18', position: { top: 220, left: 1220 } },
];

export function CharacterPreview() {
  // 더미 캐릭터 데이터
  const dummyCharacters = [
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 400,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '짜릿짜릿한',
      nickname: '김익환',
      score: 300,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '솔비 피쳐링',
      nickname: '김익방',
      score: 100,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '엠카 엔딩요정',
      nickname: '찌리릿익',
      score: 400,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '저슦두잇두잇',
      nickname: '나익키',
      score: 300,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 400,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 400,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '짜릿짜릿한',
      nickname: '김익환',
      score: 300,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '솔비 피쳐링',
      nickname: '김익방',
      score: 100,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '엠카 엔딩요정',
      nickname: '찌리릿익',
      score: 400,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '저슦두잇두잇',
      nickname: '나익키',
      score: 300,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 400,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '짜릿짜릿한',
      nickname: '김익환',
      score: 300,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '솔비 피쳐링',
      nickname: '김익방',
      score: 100,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '엠카 엔딩요정',
      nickname: '찌리릿익',
      score: 400,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '저슦두잇두잇',
      nickname: '나익키',
      score: 300,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 400,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '솔비 피쳐링',
      nickname: '김익방',
      score: 100,
    },
  ];

  return (
    <div>
      {dummyCharacters.map((character, index) => (
        <CharacterWithPositionComponent
          key={index}
          imageUrl={character.imageUrl}
          title={character.title}
          nickname={character.nickname}
          score={character.score}
          position={predefinedPositions[index].position} // 미리 지정된 위치 정보 사용
        />
      ))}
    </div>
  );
}
