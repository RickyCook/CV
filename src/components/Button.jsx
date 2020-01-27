import React, { PureComponent } from 'react';
import styled from 'styled-components/macro';


const ButtonComponent = styled.a`
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
