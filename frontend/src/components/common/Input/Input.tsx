import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showToggle?: boolean;
  hasError?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', showToggle = false, hasError = false, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
    const isPasswordType = type === 'password' && showToggle;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={isPasswordType ? (visible ? 'text' : 'password') : type}
          className={`bg-gray-100 w-full px-4 py-2 rounded-md pr-10 outline-none border transition ${
            hasError ? 'border-red-500' : ''
          } ${className}`}
          {...rest}
        />
        {isPasswordType && (
          <FontAwesomeIcon
            icon={visible ? faEye : faEyeSlash}
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
