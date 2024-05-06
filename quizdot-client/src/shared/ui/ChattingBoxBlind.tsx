// src/shared/ui//ChattingBoxBlind.tsx

export function ChattingBoxBlind() {
  return (
    <div
      className={
        'fixed bottom-3 left-0 right-0 mx-auto max-w-3xl rounded-3xl bg-white bg-opacity-80 p-4'
      }
    >
      {/* 채팅 메시지 표시 영역 */}
      <div className={'chat-messages mb-2 h-36 overflow-auto text-center'}>
        정답을 제출하셔야 채팅 입력이 가능합니다
      </div>
    </div>
  );
}
