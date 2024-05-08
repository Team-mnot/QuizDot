import type { Title } from '../api/types';

export function TitleList(titleInfo: { title: number; titleList: Title[] }) {
  console.log(titleInfo);
  return (
    <div>
      {titleInfo.titleList.map((title, id) => (
        <div key={id} className="flex">
          {/* 내가 가진 칭호면 표시, 현재 선택한 칭호면 표시 */}
          <div className={`${title.get && 'border bg-slate-200'}`}>
            {title.title}
          </div>
          <span>{title.requirement}</span>
        </div>
      ))}
    </div>
  );
}
