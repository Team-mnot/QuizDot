interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, value, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-lg border-2 px-[20px] py-[10px] shadow-lg ${className}`}
      {...props}
    >
      {value}
    </button>
  );
}
