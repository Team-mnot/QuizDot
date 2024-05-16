import type { Title } from '../api/types';
import { ChangeTitleApi } from '../api/api';
import { useUserStore } from '@/shared/stores/userStore/userStore';

export function TitleList(titleInfo: { title: number; titleList: Title[] }) {
  const store = useUserStore();

  const handleClick = async (props: number) => {
    const title = await ChangeTitleApi(props);
    if (title) {
      store.setTitle(title);
    }
  };

  return (
    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 max-h-80 overflow-y-auto ">
      <div className="flex justify-evenly">
        <span>칭호명</span>
        <span>획득조건</span>
      </div>
      {titleInfo.titleList.map((title, id) => (
        <div
          key={id}
          className={`flex justify-around ${title.get && 'bg-slate-200 hover:border-transparent hover:bg-gray-400 focus:outline-none active:bg-gray-300 '}`}
          onClick={() => handleClick(title.id)}
        >
          {/* 내가 가진 칭호면 표시, 현재 선택한 칭호면 표시 */}
          <div>{title.title}</div>
          <div>{title.requirement}</div>
        </div>
      ))}
    </div>
  );
}
