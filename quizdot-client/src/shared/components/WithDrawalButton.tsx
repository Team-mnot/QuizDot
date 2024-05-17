import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { WithdrawalApi } from '../apis/user';
import { useUserStore } from '../stores/userStore/userStore';

export function WithdrawalButton() {
  const store = useUserStore();
  const navi = useNavigate();
  const handleWithDrawal = async () => {
    window.alert('정말 탈퇴하시겠습니까?');
    const response = await WithdrawalApi();
    if (response) {
      store.resetData();

      navi('/login');
    }
  };

  return <Button onClick={handleWithDrawal} value={'회원탈퇴'} />;
}
