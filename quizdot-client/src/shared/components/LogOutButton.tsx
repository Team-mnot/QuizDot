import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { LogOutApi } from '../apis/user';
import { useUserStore } from '../stores/userStore/userStore';

export function LogOutButton() {
  const store = useUserStore();
  const navi = useNavigate();
  const handleLogOut = async () => {
    const response = await LogOutApi();

    if (response === 'success') {
      store.resetData();
      // Check: 로그아웃되면 토큰이랑 알아서 사라지는지? 로컬 스토리지는 내가 비워야 하나
      console.log('로그아웃됨');
      navi('/login');
    }
  };

  return <Button onClick={handleLogOut} value={'로그아웃'} />;
}
