type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: "primary" | "text";
};

function Button({ children, onClick, type = 'button', variant = "primary" }: ButtonProps) {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition";
  const styles =
    variant === "primary"
    ? "bg-purple-600 text-white hover:bg-purple-700"
    : "text-purple-600 hover:text-purple-800";

  return (
    <button type={type} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}


export default Button;
