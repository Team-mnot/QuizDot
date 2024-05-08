// src/shared/ui//ChattingBoxBlind.tsx

export function ChattingBoxBlind() {
  return (
    <div
      className={
        'fixed bottom-3 left-0 right-0 mx-auto max-w-3xl rounded-3xl bg-black p-4'
      }
    >
      <div
        className={
          'chat-messages mb-2 flex h-48 items-center justify-center overflow-auto text-4xl text-white'
        }
      >
        히히 정답 제출 전까지 채팅 못봐 ㅋㅋ
      </div>
    </div>
  );
}
