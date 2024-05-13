import { useRouter } from '@/shared/hooks';
import { Button } from '@/shared/ui';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { enterRoomWithLinkApi } from '../api/api';

export function InvitingLinkPage() {
  const [searchParams] = useSearchParams();

  const invitingLink = searchParams.get('data') as string;

  const router = useRouter();

  const enterRoomWithLink = async () => {
    if (localStorage.getItem('accessToken')) {
      const response = await enterRoomWithLinkApi(invitingLink);

      if (response.status == 200) {
        // router.routeToWithData(`/${roomId}/${mode}`, response.data);
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
  }, []);

  return (
    <div>
      <Button value="초대 링크로 입장" onClick={enterRoomWithLink} />
    </div>
  );
}
