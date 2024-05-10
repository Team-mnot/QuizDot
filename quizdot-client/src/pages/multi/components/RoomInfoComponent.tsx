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
    <div>
      <div className="flex">
        <p>[{props.title}]&nbsp;</p>
        <p>{props.public ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
        <p>{props.mode}&nbsp;|&nbsp;</p>
        <p>{props.maxPeople}&nbsp;인&nbsp;|&nbsp;</p>
        <p>{props.category}&nbsp;|&nbsp;</p>
        <p>{props.maxQuestion}&nbsp;문제</p>
      </div>
      <div className="flex">
        <p>초대 코드&nbsp;:&nbsp;</p>
        <p>F123D</p>
      </div>
      <div className="flex">
        <p>인원 수&nbsp;:&nbsp;</p>
        <p>0</p>
      </div>
    </div>
  );
}
