export function Answer({
  answers,
  description,
}: {
  answers: string[];
  description: string;
}) {
  return (
    <div className="absolute top-1/2 w-full text-center">
      <div className="flex">
        <p>정답 :</p>
        {answers &&
          answers.map((ans, index) => (
            <div key={ans}>
              {index == answers.length - 1 ? <p>{ans}, </p> : <p>{ans}</p>}
            </div>
          ))}
        <p></p>
      </div>
      <p>{description}</p>
    </div>
  );
}
