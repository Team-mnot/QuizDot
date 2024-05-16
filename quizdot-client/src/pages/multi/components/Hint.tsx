export function Hint({ hint }: { hint: string }) {
  return (
    <div className="absolute top-1/2 w-full text-center">
      <p>힌트 : {hint}</p>
    </div>
  );
}
