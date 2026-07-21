import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';

export const shadowStyle = (props) => css`
  box-shadow:
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgb(0, 0, 0) ${props => props.theme.shadowDistance}px ${props => props.theme.shadowDistance}px 0px 0px;
  border: ${props.theme.thickBorderWidth}px solid black;
`

const ButtonComponent = styled.a`
  ${props => shadowStyle(props)}
  padding: ${props => props.theme.spacer * props.spaceMultiplier}px;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme[(props.type || 'primary') + 'Bg']};
  text-align: center;
  display: ${props => props.block ? 'block' : 'inline'};
  cursor: pointer;

  transition: background-color 0.1s linear;

  &:hover {
    transition: background-color 0.1s linear;
    background-color: ${props => props.theme[(props.type || 'primary') + 'BrightBg']};
    color: ${props => props.theme.text};
  }
`

const BUTTON_SIZES = {
  small: 0.5,
  medium: 1,
  large: 2,
}


export class Button extends PureComponent {
  static defaultProps = {
    size: 'medium',
    type: 'primary',
    block: false,
  }
  onClick = ev => {
    ev.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    }
  }
  render() {
    const { onClick, size, ...props } = this.props
    return (
      <ButtonComponent
        href
        onClick={ this.onClick }
        spaceMultiplier={ BUTTON_SIZES[size] }
        { ...props }
      />
    )
  }
}
