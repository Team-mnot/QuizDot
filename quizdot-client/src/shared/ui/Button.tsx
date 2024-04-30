interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, value, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md border-2 px-5 shadow-md ${className}`}
      {...props}
    >
      {value}
    </button>
  );
}
