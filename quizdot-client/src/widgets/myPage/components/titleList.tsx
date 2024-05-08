import type { Title } from '../api/types';

export function TitleList(titleInfo: { title: number; titleList: Title[] }) {
  console.log(titleInfo);
  return (
    <div>
      {titleInfo.title}
      {titleInfo.titleList.map((title, id) => (
        <div key={id}>
          <p>{title.title}</p>
          <p>{title.requirement}</p>
          {title.get && '바보'}
        </div>
      ))}
    </div>
  );
}
