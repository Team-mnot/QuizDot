interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, value, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg border-2 px-5 shadow-lg ${className}`}
      {...props}
    >
      {value}
    </button>
  );
}
