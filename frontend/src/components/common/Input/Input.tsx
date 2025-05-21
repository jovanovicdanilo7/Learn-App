import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={`bg-transparent w-full outline-none ${className}`}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
