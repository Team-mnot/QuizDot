interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      className={`rounded-md border-2 bg-white p-5 shadow-md ${className}`}
      type={type}
      {...props}
    />
  );
}
