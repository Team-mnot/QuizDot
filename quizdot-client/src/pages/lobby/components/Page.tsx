import { ChattingBox } from '@/shared/ui/ChattingBox';
import { RoomListComponent } from './RoomListComponent';
import { useEffect } from 'react';
import { OnlineUserListComponent } from './OnlineUserListComponent';
import { MyProfileComponent } from './MyProfileComponent';

export function LobbyPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <div>
        <h1>로비</h1>
        <div className={'flex'}>
          <OnlineUserListComponent />
          <RoomListComponent />
        </div>
        <div className={'flex'}>
          <MyProfileComponent />
          <ChattingBox />
        </div>
      </div>
    </div>
  );
}
