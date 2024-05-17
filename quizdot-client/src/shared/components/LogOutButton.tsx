import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { LogOutApi } from '../apis/user';
import { useUserStore } from '../stores/userStore/userStore';

export function LogOutButton() {
  const store = useUserStore();
  const navi = useNavigate();
  const handleLogOut = async () => {
    const response = await LogOutApi();
    if (response) {
      localStorage.removeItem('accessToken');
      store.resetData();
      navi('/login');
    }
  };

  return <Button onClick={handleLogOut} value={'로그아웃'} />;
}
