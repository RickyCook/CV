import React, { PureComponent }from 'react';
import styled, { css } from 'styled-components/macro';

import 'typeface-major-mono-display';


const sharedStyle = css`
  font-family: 'Major Mono Display';
  color: ${props => props.theme.background};
  background-color: ${props => props.theme.primary};
  padding: ${props => '' +  props.theme.spacer + 'px'};
  display: inline-block;
`
const withWrapper = WrappedComponent => props => <div><WrappedComponent {...props} /></div>

export const Header1 = withWrapper(styled.h1`
  ${sharedStyle}
`)
export const Header2 = withWrapper(styled.h2`
  ${sharedStyle}
`)
