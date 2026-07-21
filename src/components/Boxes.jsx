import _ from 'lodash';
import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components';

import { contacts } from '../contacts'
import * as Header from './Header';
import { ExternalLink } from './Link';
import { PrintOnly, ScreenOnly } from './Media';
import { shadowStyle } from './Button';


const CONTACT_ME = contacts && contacts['Ricky Cook'];


const BaseBox = styled.div`
  ${props => shadowStyle(props)}

  background-color: rgba(20,20,25,0.8);
  position: fixed;
  right: 0px;

  @media print {
    position: absolute;
  }
`
const TopBox = styled(BaseBox)`
  top: 0px;
`
const TopBoxClickable = styled(TopBox)`
  background-color: ${props => props.theme.boxClickableBg};
  cursor: pointer;

  &:hover {
    transition: background-color 0.1s linear;
    background-color: ${props => props.theme.boxClickableBrightBg};
  }
`
const BottomBox = styled(BaseBox)`
  position: fixed;
  bottom: 0px;
`
const BottomBoxClickable = styled(BottomBox)`
  background-color: ${props => props.theme.boxClickableBg};
  cursor: pointer;

  &:hover {
    transition: background-color 0.1s linear;
    background-color: ${props => props.theme.boxClickableBrightBg};
  }
`
const BoxHeaderShared = styled.div`
  ${Header.fontStyle}

  ${TopBoxClickable} &, ${BottomBoxClickable} & {
    color: ${props => props.theme.boxClickableText};
  }
`
const BoxHeaderWrapper = styled.div`
  display: flex;
  align-items: stretch;
  height: ${props => props.theme.boxHeaderHeight}px;
  background-color: ${props => props.theme.primaryBg};
  border-bottom: 3px solid black;
`;
const BoxHeader = styled(BoxHeaderShared)`
  ${Header.fontStyle}
  font-weight: bold;
  background-color: ${props => props.theme.primaryBg};
  color: ${props => props.theme[(props.type || 'primary') + 'Text']};
  padding: ${props => props.theme.spacer + 1}px;
  padding-left: ${props => props.theme.spacer}px;
  flex-grow: 1;

  ${TopBoxClickable} &, ${BottomBoxClickable} & {
    color: ${props => props.theme.boxClickableText};
  }
`
const BoxHeaderButton = styled(BoxHeaderShared)`
  color: ${props => props.theme.primaryText};
  text-shadow:
    0 0 0 ${props => props.theme.primaryDark},
    0 0 0 ${props => props.theme.primaryDark},
    1px 1px 0 ${props => props.theme.primaryDark},
    1px 1px 0 ${props => props.theme.primaryDark};
  padding: ${props => props.theme.spacer + 1}px;

  &:hover {
    transition: background-color 0.1s linear;
    background-color: ${props => props.theme.primaryDark};
  }
`
const BoxVerticalHeader = styled(BoxHeaderShared)`
  writing-mode: vertical-rl;
  text-orientation: sideways;
  padding-right: ${props => props.theme.spacer * 3}px;
`
const BoxContent = styled.div`
  font-size: 0.75em;
  padding: ${props => props.theme.bodyMargin}px;
`
const BoxRow = styled.div`
  padding-top: ${props => props.theme.spacer * 0.75}px;
`
const BoxLabel = styled.span`
  ${Header.fontStyle}
  background-color: ${props => props.theme.secondary};
  padding: ${props => props.theme.spacer * 0.75}px ${props => props.theme.bodyMargin}px;
  margin-left: -${props => props.theme.bodyMargin}px;
  margin-right: ${props => props.theme.spacer}px;
  display: inline-block;
`
const Highlight = styled.span`
  color: ${props => props.theme.text};
`


const BoxBodyWrapper = styled.div`
  white-space: nowrap;
  display: ${props => props.show ? 'block' : 'none'};

  @media print {
    display: block;
  }
`


class BoxBody extends PureComponent {
  render() {
    const { boxShown, children, header, hideable, onClose, position } = this.props

    const Component = {
      top: TopBox,
      bottom: BottomBox,
    }[position];

    return (
      <BoxBodyWrapper show={ boxShown }>
        <Component>
          <BoxHeaderWrapper>
            <BoxHeader>{ header }</BoxHeader>
            { hideable && (
              <ScreenOnly>
                <BoxHeaderButton onClick={ onClose }>x</BoxHeaderButton>
              </ScreenOnly>
            ) }
          </BoxHeaderWrapper>
          <BoxContent>
            { children }
          </BoxContent>
        </Component>
      </BoxBodyWrapper>
    );
  }
}
class BoxExpander extends PureComponent {
  render() {
    const { boxShown, header, onClick, position } = this.props

    const Component = {
      top: TopBoxClickable,
      bottom: BottomBoxClickable,
    }[position];

    return (
      <ScreenOnly style={{ display: boxShown ? 'none' : undefined }}>
        {/* maxWidth is a hack for FF rendering/hydration issue */}
        <Component onClick={ onClick } style={{ maxWidth: '53px' }}>
          <BoxContent>
            <BoxVerticalHeader>
              { header } <span style={{ fontSize: '0.75rem' }}>&#x25B3;</span>
            </BoxVerticalHeader>
          </BoxContent>
        </Component>
      </ScreenOnly>
    );
  }
}


class Box extends PureComponent {
  state = {
    show: null,
    hideable: false,
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  handleResize = () => {
    const { show } = this.state
    if (window.innerWidth < 1500) {
      this.setState({ hideable: true, show: _.isNil(show) ? false : show })
    } else {
      this.setState({ hideable: false, show: _.isNil(show) ? true : show })
    }
  }
  handleExpandClick = () => {
    this.setState({ show: true });
  }
  handleBodyClose = () => {
    this.setState({ show: false });
  }
  render() {
    const { header, position, children } = this.props;
    const { hideable, show } = this.state;

    return (
      <Fragment>
        <BoxExpander
          boxShown={ show }
          header={ header }
          position={ position }
          onClick={ this.handleExpandClick }
        />
        <BoxBody
          hideable={ hideable }
          boxShown={ show }
          header={ header }
          position={ position }
          onClose={ this.handleBodyClose }
        >
          { children }
        </BoxBody>
      </Fragment>
    );
  }
}


export class Details extends PureComponent {
  state = {
    show: false,
  }
  handleClick = () => {
    this.setState({ show: !this.state.show })
  }
  render() {
    return (
      <Box header="Details" position="top">
        <div>
          <BoxLabel>phone</BoxLabel>
          { (CONTACT_ME && CONTACT_ME.phone) || 'Contact for info' }
        </div>
        <div>
          <BoxLabel>email</BoxLabel>
          { CONTACT_ME && CONTACT_ME.email
            ? <ExternalLink href={ `mailto:${CONTACT_ME.email}` }>{ CONTACT_ME.email }</ExternalLink>
            : 'Contact for info'
          }
        </div>
        <div>
          <BoxLabel>twttr</BoxLabel>
          <ExternalLink href="https://twitter.com/thatpandadev"><Highlight>@</Highlight>thatpandadev</ExternalLink>
        </div>
        <PrintOnly>
          <div>
            <BoxLabel>&nbsp;&nbsp;web</BoxLabel>
            <ExternalLink href="https://thatpanda.com">thatpanda.com</ExternalLink>
          </div>
        </PrintOnly>
        <BoxRow>
          <ExternalLink href="https://github.com/rickycook/CV">
            <PrintOnly>github.com/rickycook/CV</PrintOnly>
            <ScreenOnly>rickycook/CV</ScreenOnly>
          </ExternalLink>
        </BoxRow>
      </Box>
    )
  }
}

export class BuildInfo extends PureComponent {
  render() {
    return (
      <ScreenOnly>
        <Box header="Built Using" position="bottom">
          <div>
            [
              <ExternalLink href="https://reactjs.org/">React</ExternalLink>,
              <ExternalLink href="https://styled-components.com">styled-components</ExternalLink>,<br/>
              <ExternalLink href="https://workers.cloudflare.com/">CloudFlare Workers</ExternalLink>,
              <ExternalLink href="https://pages.cloudflare.com/">CloudFlare Pages</ExternalLink>
            ]
          </div>
        </Box>
      </ScreenOnly>
    )
  }
}
