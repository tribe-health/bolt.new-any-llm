import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { classNames } from '~/utils/classNames';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  className?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ title, className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        title={title}
        className={classNames(
          'flex items-center justify-center p-2 rounded-lg transition-colors',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
