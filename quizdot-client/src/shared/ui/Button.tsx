interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, value, ...props }: ButtonProps) {
  return (
    <button className={`rounded-lg border-2 shadow-lg ${className}`} {...props}>
      {value}
    </button>
  );
}
