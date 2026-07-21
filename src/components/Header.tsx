import styled, { css } from 'styled-components';

import 'typeface-share-tech-mono';

export const fontStyle = css`
  font-family: 'Share Tech Mono';
`;

const sharedStyle = css`
  ${fontStyle}
  color: ${(props: { theme: import('styled-components').DefaultTheme; type?: 'primary' | 'secondary' | 'plain' }) => props.theme[`${props.type || 'primary'}Text`]};
  background-color: ${(props: { theme: import('styled-components').DefaultTheme; type?: 'primary' | 'secondary' | 'plain' }) => props.theme[`${props.type || 'primary'}Bg`]};
  border-left: 10px solid ${(props: { theme: import('styled-components').DefaultTheme; type?: 'primary' | 'secondary' | 'plain' }) => props.theme[`${props.type || 'primary'}LeftStripeBg`]};
  padding: ${(props) => props.theme.spacer}px;
  margin: ${(props) => props.theme.spacer * 1.5}px 0px;
  display: inline-block;

  @media print {
    padding: 0px;
    margin: 0px;
    border: none;
  }
`;
export const PrimaryHighlight = styled.span`
  color: ${(props) => props.theme.primaryHighlight};
`;
export const HeaderChevronWrapper = styled(PrimaryHighlight)`
  padding-right: ${(props) => props.theme.spacer}px;
  display: inline-block;
  width: ${(props) => props.theme.chevronWidth}px;

  @media print {
    color: ${(props) => props.theme.primary};
  }
`;
interface HeaderProps {
  children?: React.ReactNode;
  type?: 'primary' | 'secondary' | 'plain';
  trail?: boolean;
}
const withWrapper =
  (WrappedComponent: React.ComponentType<HeaderProps>) => (props: HeaderProps) => (
    <div>
      <WrappedComponent {...props}>
        <HeaderChevronWrapper>&gt;</HeaderChevronWrapper>
        {props.children}
        {props.trail && <HeaderChevronWrapper>_</HeaderChevronWrapper>}
      </WrappedComponent>
    </div>
  );

export const Header1 = withWrapper(styled.h1<HeaderProps>`
  ${sharedStyle}
`);
export const BodyHeader = styled(Header1)`
  margin-top: ${(props) => `-${props.theme.bodyMargin}px`};
  margin-left: ${(props) => `-${props.theme.bodyMargin}px`};
  padding: ${(props) => props.theme.spacer + props.theme.bodyMargin}px;

  @media print {
    padding: 0px;
    margin: 0px;
  }
`;
export const Header2 = withWrapper(styled.h2<HeaderProps>`
  ${sharedStyle}
`);
export const Header3 = withWrapper(styled.h3<HeaderProps>`
  ${sharedStyle}
`);
export const Header4 = withWrapper(styled.h4<HeaderProps>`
  ${sharedStyle}
  border-left-color: rgba(255,255,255,0.1);
`);

export const SubHeader = styled.div<HeaderProps>`
  margin-top: -${(props) => props.theme.spacer * 3.5}px;
  margin-bottom: ${(props) => props.theme.spacer * 1.5}px;
  padding-left: ${(props) => (props.theme.spacer * 2) + props.theme.chevronWidth}px;
  padding-right: ${(props) => props.theme.spacer * 2.5}px;
  padding-top: ${(props) => props.theme.spacer}px;
  padding-bottom: ${(props) => props.theme.spacer}px;
  color: ${(props) => props.theme[`${props.type || 'primary'}Text`]};
  background-color: ${(props) => props.theme[`${props.type || 'primary'}Bg`]};
  border-left: 10px solid ${(props) => props.theme[`${props.type || 'primary'}LeftStripeBg`]};
  display: table;

  @media print {
    padding: 0px;
    margin-top: -${(props) => props.theme.spacer * 0.5}px;
    border: none;
  }
`;
