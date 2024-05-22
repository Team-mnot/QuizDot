interface GetCharacterProps {
  character: number;
}

export function GetCharacter(props: GetCharacterProps) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: '300px', height: '210px' }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: 'black',
        }}
      >
        <img className="" src={`/images/${props.character}.gif`} alt="" />
      </div>
      <span className="mt-1">No {props.character}</span>
      <span className="mt-6">캐릭터를 뽑았습니다</span>
      <span className="mt-1 text-lg">Enter ▶ 다시 뽑기</span>
    </div>
  );
}
