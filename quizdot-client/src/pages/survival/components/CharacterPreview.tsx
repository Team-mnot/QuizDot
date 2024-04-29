// src/pages/survival/components/CharacterPreview.tsx

import { CharacterInSurvivalModeComponent } from "./CharacterInSurvivalModeComponent";

// 미리 지정된 위치 정보
const predefinedPositions = [
  { id: 'grid-item-1', position: { top: 30, left: 22 } },
  { id: 'grid-item-2', position: { top: 20, left: 42 } },
  { id: 'grid-item-3', position: { top: 25, left: 64 } },
  { id: 'grid-item-4', position: { top: 24, left: 90 } },
  { id: 'grid-item-5', position: { top: 39, left: 67 } },
  { id: 'grid-item-6', position: { top: 42, left: 97 } },
  { id: 'grid-item-7', position: { top: 66, left: 6 } },
  { id: 'grid-item-8', position: { top: 63, left: 12 } },
  { id: 'grid-item-9', position: { top: 87, left: 13 } },
  { id: 'grid-item-10', position: { top: 16, left: 82 } },
  { id: 'grid-item-11', position: { top: 66, left: 86 } },
  { id: 'grid-item-12', position: { top: 0, left: 0 } },
  { id: 'grid-item-13', position: { top: 0, left: 0 } },
  { id: 'grid-item-14', position: { top: 0, left: 0 } },
  { id: 'grid-item-15', position: { top: 0, left: 0 } },
  { id: 'grid-item-16', position: { top: 0, left: 0 } },
  { id: 'grid-item-17', position: { top: 0, left: 0 } },
  { id: 'grid-item-18', position: { top: 0, left: 0 } },
];

export function CharacterPreview() {
  // 더미 캐릭터 데이터
  const dummyCharacters = [
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 500,
      isAlive: true,
      isRevive: true,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '짜릿짜릿한',
      nickname: '김익환',
      score: 300,
      isAlive: false,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '솔비 피쳐링',
      nickname: '김익방',
      score: 100,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '엠카 엔딩요정',
      nickname: '찌리릿익',
      score: 500,
      isAlive: false,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '저슦두잇두잇',
      nickname: '나익키',
      score: 300,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 400,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 400,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '짜릿짜릿한',
      nickname: '김익환',
      score: 300,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '솔비 피쳐링',
      nickname: '김익방',
      score: 100,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '엠카 엔딩요정',
      nickname: '찌리릿익',
      score: 400,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '저슦두잇두잇',
      nickname: '나익키',
      score: 300,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 400,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '짜릿짜릿한',
      nickname: '김익환',
      score: 300,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '솔비 피쳐링',
      nickname: '김익방',
      score: 100,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '엠카 엔딩요정',
      nickname: '찌리릿익',
      score: 400,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '저슦두잇두잇',
      nickname: '나익키',
      score: 300,
      isAlive: true,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '오늘밤 두잇두잇',
      nickname: '익찌리릿',
      score: 400,
      isAlive: false,
      isRevive: false,
    },
    {
      imageUrl: '/images/ikball.png',
      title: '솔비 피쳐링',
      nickname: '김익방',
      score: 100,
      isAlive: true,
      isRevive: true,
    },
  ];

  return (
    <div>
      {dummyCharacters.map((character, index) => (
        <CharacterInSurvivalModeComponent
          key={index}
          imageUrl={character.imageUrl}
          title={character.title}
          nickname={character.nickname}
          score={character.score}
          position={predefinedPositions[index].position} // 미리 지정된 위치 정보 사용
          isAlive={character.isAlive}
          isRevive={character.isRevive}
        />
      ))}
    </div>
  );
}
