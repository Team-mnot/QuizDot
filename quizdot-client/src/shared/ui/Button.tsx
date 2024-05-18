interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ value, ...props }: ButtonProps) {
  return (
    <button
      className="hover:border-transparent hover:bg-slate-200 focus:outline-none active:bg-slate-300"
      {...props}
    >
      {value}
    </button>
  );
}
