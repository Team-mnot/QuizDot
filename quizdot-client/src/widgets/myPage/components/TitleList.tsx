import type { Title } from '../api/types';
import { ChangeTitleApi } from '../api/api';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import '@/shared/css/index.css';

export function TitleList(titleInfo: { title: number; titleList: Title[] }) {
  const store = useUserStore();

  const handleClick = async (props: number) => {
    const title = await ChangeTitleApi(props);
    if (title) {
      store.setTitle(title);
    }
  };

  return (
    <div
      className="custom-scrollbar overflow-y-auto border p-2 shadow-md "
      style={{ height: '333px' }}
    >
      {titleInfo.titleList.map((title, id) => (
        <div
          key={id}
          className={`flex items-center justify-between pl-10 text-gray-400 ${title.get && ' text-black hover:border-transparent'}`}
        >
          <div className="flex items-center">
            <div
              className={`m-2 flex-none cursor-pointer rounded-lg border-2 bg-white p-1 px-6 text-center shadow-md ${title.get && 'hover:bg-gray-100 active:bg-gray-300'}`}
              style={{ width: '220px' }}
              onClick={() => handleClick(title.id)}
            >
              {title.title}
            </div>
          </div>
          <div className="flex-grow pl-10 text-left">{title.requirement}</div>
        </div>
      ))}
    </div>
  );
}
