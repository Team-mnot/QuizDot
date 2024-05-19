export function Hint({ hint }: { hint: string }) {
  return (
    <div className="mt-1 flex rounded-md bg-white bg-opacity-80 p-2 text-3xl">
      <p>힌트&nbsp;:&nbsp;{hint}</p>
    </div>
  );
}
