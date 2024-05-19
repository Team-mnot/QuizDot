export function Answer({
  answers,
  description,
}: {
  answers: string[];
  description: string;
}) {
  return (
    <div>
      <div className="">
        <p className="mt-1 flex rounded-md bg-white bg-opacity-80 p-2 text-3xl">
          정답&nbsp;:&nbsp;
        </p>
        {answers &&
          answers.map((ans, index) => (
            <div key={ans}>
              {index == answers.length - 1 ? <p>{ans}</p> : <p>{ans},&nbsp;</p>}
            </div>
          ))}
      </div>
      <p>{description}</p>
    </div>
  );
}
