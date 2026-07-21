import type { AnchorHTMLAttributes, MouseEvent } from 'react';

import { tv } from 'tailwind-variants';

export const shadowBrutal = 'shadow-brutal';

const buttonTv = tv({
  base: 'shadow-brutal text-text text-center cursor-pointer transition-colors duration-100 hover:text-text',
  variants: {
    type: {
      primary: 'bg-primary hover:bg-primary-light',
      secondary: 'bg-secondary hover:bg-secondary-light',
    },
    block: {
      true: 'block',
      false: 'inline',
    },
  },
  defaultVariants: { type: 'primary', block: false },
});

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonType = 'primary' | 'secondary';

interface ButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type' | 'onClick'> {
  onClick?: () => void;
  size?: ButtonSize;
  type?: ButtonType;
  block?: boolean;
}

const sizeClass: Record<ButtonSize, string> = {
  small: 'px-[5px] py-[2.5px]',
  medium: 'px-[10px] py-[5px]',
  large: 'px-[20px] py-[10px]',
};

export const Button = ({
  onClick,
  size = 'medium',
  type = 'primary',
  block = false,
  ...props
}: ButtonProps) => {
  const handleClick = (ev: MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    onClick?.();
  };
  return (
    <a
      href=""
      onClick={handleClick}
      className={`${buttonTv({ type, block })} ${sizeClass[size]}`}
      {...props}
    />
  );
};
