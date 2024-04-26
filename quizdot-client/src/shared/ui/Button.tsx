interface ButtonProps {
  className: string;
  label: string;
  onClick: () => void;
}

export function Button(props: ButtonProps) {
  return (
    <button
      className={`rounded-md border-2 p-2 shadow-md ${props.className}`}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}
