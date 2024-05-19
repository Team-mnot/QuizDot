import { useEffect } from 'react';

export function IlgitoPage() {
  // const { channelId, roomId } = useParams() as {
  //   channelId: string;
  //   roomId: string;
  // };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return <div></div>;
}
