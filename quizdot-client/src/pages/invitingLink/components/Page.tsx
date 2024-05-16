import { useRouter } from '@/shared/hooks';
import { Button } from '@/shared/ui';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { enterRoomWithLinkApi } from '../api/api';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';

export function InvitingLinkPage() {
  const [searchParams] = useSearchParams();
  const link = searchParams.get('data') as string;

  const router = useRouter();
  const roomStore = useRoomStore();

  // 초대 링크로 게임 대기실 입장
  const enterRoomWithLink = async () => {
    if (localStorage.getItem('accessToken')) {
      const response = await enterRoomWithLinkApi(link);

      console.log(response);

      if (response.status == 200) {
        roomStore.fetchRoom(response.data.roomInfo);
        roomStore.fetchPlayers(response.data.players);

        if (roomStore.roomInfo && roomStore.players)
          router.routeTo(
            `/${roomStore.roomInfo.roomId % 1000}/${roomStore.roomInfo.roomId}/waiting`,
          );
        // 일대일 모드 추가 예정
      } else {
        router.routeTo('/login');
      }
    } else {
      router.routeTo('/login');
    }
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';

    console.log(link);
  }, []);

  return (
    <div>
      {link ? 1 : 0}
      <Button value="초대 링크로 입장" onClick={enterRoomWithLink} />
    </div>
  );
}
