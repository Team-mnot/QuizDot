export function Answer({
  answers,
  description,
}: {
  answers: string[];
  description: string;
}) {
  return (
    <div className="flex flex-col justify-center">
      <div className="mt-1 flex justify-center rounded-md bg-white bg-opacity-80 p-2 text-3xl">
        정답&nbsp;:&nbsp;
        {answers &&
          answers.map((ans, index) => (
            <div key={ans}>
              {index == answers.length - 1 ? <p>{ans}</p> : <p>{ans},&nbsp;</p>}
            </div>
          ))}
      </div>
      {description && (
        <div className="mt-1 max-w-[640px] rounded-md bg-white bg-opacity-80 p-2">
          {description}
        </div>
      )}
    </div>
  );
}
