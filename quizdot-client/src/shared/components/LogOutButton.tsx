import { useNavigate } from 'react-router-dom';
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
    localStorage.removeItem('accessToken');
    store.resetData();
    navi('/login');
  };

  return (
    <div
      onClick={handleLogOut}
      className="custom-blinking custom-pink custom-btn-transparent text-border mr-4 flex cursor-pointer items-center"
    >
      로그아웃
    </div>
  );
}
