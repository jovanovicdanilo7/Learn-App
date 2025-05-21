type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: "primary" | "text" | "icon";
  className?: string;
  disabled?: boolean;
};

function Button({ children, onClick, type = 'button', variant = "primary", className = '', disabled }: ButtonProps) {
  const base = "px-4 py-2 rounded-md text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-purple-600 text-white hover:bg-purple-700"
      : variant === "icon"
      ? "text-gray-500 hover:text-gray-700"
      : "text-purple-600 hover:text-purple-800";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
