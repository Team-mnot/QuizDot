interface GetColorProps {
  color: string;
}

export function GetColor(props: GetColorProps) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: '300px', height: '210px' }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: props.color,
        }}
      ></div>
      <span className="mt-1">{props.color}</span>
      <span className="mt-6">닉네임 색상이 변경되었습니다</span>
      <span className="mt-1 text-lg">Enter ▶ 다시 뽑기</span>
    </div>
  );
}
