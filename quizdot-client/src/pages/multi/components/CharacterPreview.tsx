import { Modal } from '@/shared/ui';
import { useOpenModal } from '@/shared/hooks';
import { useState } from 'react';
import { CharacterComponent } from './CharacterComponent';

export function CharacterPreview() {
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
  ];

  const { isOpenModal, clickModal, closeModal } = useOpenModal();
  const [nickname, setNickname] = useState('');

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '0px',
        }}
        className={'flex w-full justify-between p-5'}
      >
        <div>
          {dummyCharacters
            .slice(0, dummyCharacters.length - 4)
            .map((character, index) => (
              <div
                key={index}
                onClick={() => {
                  setNickname(character.nickname);
                  clickModal();
                }}
              >
                <CharacterComponent
                  margin={'p-2'}
                  size={'h-20 w-20'}
                  imageUrl={character.imageUrl}
                  title={character.title}
                  nickname={character.nickname}
                  score={character.score}
                />
              </div>
            ))}
        </div>
        <div>
          {dummyCharacters.length >= 4 &&
            dummyCharacters
              .slice(4, dummyCharacters.length)
              .map((character, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setNickname(character.nickname);
                    clickModal();
                  }}
                >
                  <CharacterComponent
                    margin={'p-2'}
                    size={'h-20 w-20'}
                    imageUrl={character.imageUrl}
                    title={character.title}
                    nickname={character.nickname}
                    score={character.score}
                  />
                </div>
              ))}
        </div>
      </div>

      <Modal isOpen={isOpenModal} onClose={closeModal}>
        <div className={'h-96 w-96'}>{nickname}</div>
      </Modal>
    </div>
  );
}
