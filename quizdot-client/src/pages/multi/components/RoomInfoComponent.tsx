interface RoomInfoProps {
  title: string;
  public: boolean;
  password: string;
  mode: string;
  maxPeople: number;
  category: string;
  maxQuestion: number;
}

export function RoomInfoComponent(props: RoomInfoProps) {
  return (
    <div className="flex">
      <p>[{props.title}]&nbsp;</p>
      <p>{props.public ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
      <p>{props.mode}&nbsp;|&nbsp;</p>
      <p>{props.maxPeople} 인&nbsp;|&nbsp;</p>
      <p>{props.category}&nbsp;|&nbsp;</p>
      <p>{props.maxQuestion} 개 문제</p>
    </div>
  );
}
