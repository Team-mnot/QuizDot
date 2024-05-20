/* eslint-disable prettier/prettier */
interface BallonProps {
  className: string;
  message: string;
}

export function Ballon(props: BallonProps) {
  return (
    <div
      className={`relative rounded-md border-2 border-r-2 bg-white p-2 shadow-md ${props.className}`}
    >
      <div className="">{props.message}</div>
    </div>
  );
}
