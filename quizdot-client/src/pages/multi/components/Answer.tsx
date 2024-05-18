export function Answer({
  answers,
  description,
}: {
  answers: string[];
  description: string;
}) {
  return (
    <div className="absolute w-full text-center top-1/2">
      <div className="flex">
        <p>정답 :</p>
        {answers &&
          answers.map((ans, index) => (
            <p key={ans}>
              {index == answers.length - 1 ? <p>{ans}, </p> : <p>{ans}</p>}
            </p>
          ))}
        <p></p>
      </div>
      <p>{description}</p>
    </div>
  );
}
