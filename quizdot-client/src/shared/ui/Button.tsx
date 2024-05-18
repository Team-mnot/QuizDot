interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ value, ...props }: ButtonProps) {
  return <button {...props}>{value}</button>;
}
