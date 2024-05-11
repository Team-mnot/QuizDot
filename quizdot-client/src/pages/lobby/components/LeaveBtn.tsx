import { Button } from '@/shared/ui';
import { useRouter } from '@/shared/hooks';

export function LeaveBtn() {
  const router = useRouter();

  const leaveRoom = () => {
    router.routeTo('/channel');
  };

  return <Button value="로비로 이동" onClick={leaveRoom} />;
}
