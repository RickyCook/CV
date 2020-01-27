import React from 'react';
import styled, { css } from 'styled-components/macro';

import 'typeface-major-mono-display';

export const fontStyle = css`
  font-family: 'Major Mono Display';
`

const sharedStyle = css`
  ${fontStyle}
  color: ${props => props.theme[(props.type || 'primary') + 'Text']};
  background-color: ${props => props.theme[(props.type || 'primary') + 'Bg']};
  padding: ${props => props.theme.spacer}px;
  margin: ${props => props.theme.spacer * 1.5}px 0px;
  display: inline-block;
  text-transform: lowercase;

  @media print {
    padding: 0px;
  }
`
export const PrimaryHighlight = styled.span`
  color: ${props => props.theme.primaryHighlight};
`
export const HeaderChevronWrapper = styled(PrimaryHighlight)`
  padding-right: ${props => props.theme.spacer}px;
  display: inline-block;
  width: ${props => props.theme.chevronWidth}px;

  @media print {
    display: none;
  }
`
const withWrapper = WrappedComponent => ({ children, ...props }) => (
  <div>
    <WrappedComponent {...props}>
      <HeaderChevronWrapper>&gt;</HeaderChevronWrapper>
      { children }
      { props.trail && <HeaderChevronWrapper>_</HeaderChevronWrapper> }
    </WrappedComponent>
  </div>
)

export const Header1 = withWrapper(styled.h1`
  ${sharedStyle}
`)
export const BodyHeader = styled(Header1)`
  margin-top: ${props => '-' + props.theme.bodyMargin}px;
  margin-left: ${props => '-' + props.theme.bodyMargin}px;
  padding: ${props => props.theme.spacer + props.theme.bodyMargin}px;

  @media print {
    padding: 0px;
    margin: 0px;
  }
`
export const Header2 = withWrapper(styled.h2`
  ${sharedStyle}
`)
export const Header3 = withWrapper(styled.h3`
  ${sharedStyle}
`)
export const Header4 = withWrapper(styled.h4`
  ${sharedStyle}
`)

export const SubHeader = styled.div`
  margin-top: -${props => props.theme.spacer * 3.5}px;
  margin-bottom: ${props => props.theme.spacer * 1.5}px;
  padding-left: ${props => (props.theme.spacer * 2) + props.theme.chevronWidth}px;
  padding-right: ${props => props.theme.spacer * 2.5}px;
  padding-top: ${props => props.theme.spacer}px;
  padding-bottom: ${props => props.theme.spacer}px;
  color: ${props => props.theme[(props.type || 'primary') + 'Text']};
  background-color: ${props => props.theme[(props.type || 'primary') + 'Bg']};
  display: table;

  @media print {
    padding: 0px;
    margin-top: -${props => props.theme.spacer * 1.5}px;
  }
`
