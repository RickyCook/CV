import styled, { css } from 'styled-components';

export const shadowStyle = css`
  box-shadow:
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgb(0, 0, 0) ${(props) => props.theme.shadowDistance}px ${(props) => props.theme.shadowDistance}px 0px 0px;
  border: ${(props) => props.theme.thickBorderWidth}px solid black;
`;

const BUTTON_SIZES = {
  small: 0.5,
  medium: 1,
  large: 2,
} as const;

type ButtonSize = keyof typeof BUTTON_SIZES;
type ButtonType = 'primary' | 'secondary';

const ButtonComponent = styled.a<{ spaceMultiplier: number; type: ButtonType; block: boolean }>`
  ${shadowStyle}
  padding: ${(props) => props.theme.spacer * props.spaceMultiplier}px;
  color: ${(props) => props.theme.text};
  background-color: ${(props) => props.theme[`${props.type || 'primary'}Bg`]};
  text-align: center;
  display: ${(props) => (props.block ? 'block' : 'inline')};
  cursor: pointer;

  transition: background-color 0.1s linear;

  &:hover {
    transition: background-color 0.1s linear;
    background-color: ${(props) => props.theme[`${props.type || 'primary'}BrightBg`]};
    color: ${(props) => props.theme.text};
  }
`;

export const Button = ({
  onClick,
  size = 'medium',
  type = 'primary',
  block = false,
  ...props
}: { onClick?: () => void; size?: ButtonSize; type?: ButtonType; block?: boolean } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'type' | 'onClick'
>) => {
  const handleClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    if (onClick) {
      onClick();
    }
  };
  return (
    <ButtonComponent
      href=""
      onClick={handleClick}
      spaceMultiplier={BUTTON_SIZES[size]}
      type={type}
      block={block}
      {...props}
    />
  );
};
