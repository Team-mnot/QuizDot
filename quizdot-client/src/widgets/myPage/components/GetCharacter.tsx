interface GetCharacterProps {
  character: number;
}

export function GetCharacter(props: GetCharacterProps) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ width: '300px', height: '200px' }}
    >
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: 'black',
        }}
      >
        {props.character}
      </div>
      <span className="mt-1">{props.character}</span>
      <span className="mt-6">캐릭터를 얻었습니다</span>
    </div>
  );
}
