import React, { PureComponent } from 'react';
import styled from 'styled-components/macro';

import { contacts } from '../contacts'
import * as Header from './Header';
import { PrintOnly, ScreenOnly } from './Media'


const CONTACT_ME = contacts && contacts['Ricky Cook'];


const BaseBox = styled.div`
  background-color: rgba(20,20,25,0.8);
  position: fixed;
  right: 0px;
  padding: ${props => props.theme.bodyMargin}px;

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
const BoxHeader = styled.div`
  ${Header.fontStyle}
  margin-bottom: ${props => props.theme.spacer}px;

  ${TopBoxClickable} &, ${BottomBoxClickable} & {
    color: ${props => props.theme.boxClickableText};
  }
`
const BoxHeaderButton = styled(BoxHeader)`
  background-color: ${props => props.theme.primaryBg};
  color: ${props => props.theme.primaryText};
  cursor: pointer;
  float: right;
  padding: ${props => props.theme.spacer}px;
  margin-top: -${props => props.theme.spacer * 1.5}px;
  margin-right: -${props => props.theme.spacer * 1.5}px;

  &:hover {
    transition: background-color 0.1s linear;
    background-color: ${props => props.theme.primaryDark};
  }
`
const BoxVerticalHeader = styled(BoxHeader)`
  writing-mode: vertical-rl;
  text-orientation: sideways;
  padding-right: ${props => props.theme.spacer * 3}px;
  background-color: ${props => props.theme.boxClickableBg};

  ${TopBoxClickable}:hover &, ${BottomBoxClickable}:hover & {
    transition: background-color 0.1s linear;
    background-color: ${props => props.theme.boxClickableBrightBg};
  }
`
const BoxContent = styled.div`
  font-size: 0.75em;
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


class ExternalLink extends PureComponent {
  render() {
    const { children, ...props } = this.props
    return <a rel="noopener noreferrer" target="_blank" { ...props }>{ children }</a>
  }
}


class Box extends PureComponent {
  state = {
    show: false,
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
    if (window.innerWidth < 1500) {
      this.setState({ hideable: true })
    } else {
      this.setState({ hideable: false })
    }
  }
  handleClick = () => {
    this.setState({ show: !this.state.show });
  }
  render() {
    const { header, position, children } = this.props;
    const { hideable, show } = this.state;

    let BoxComponent;
    let ClickableBoxComponent;
    switch(position) {
    case 'top':
      BoxComponent = TopBox;
      ClickableBoxComponent = TopBoxClickable;
      break;
    case 'bottom':
      BoxComponent = BottomBox;
      ClickableBoxComponent = BottomBoxClickable;
      break;
    default:
      throw new Error('Invalid position option');
    }

    if (hideable && !show) {
      return (
        <ClickableBoxComponent
          onClick={ this.handleClick }
        >
          <BoxVerticalHeader>
            { header } <span style={{ fontSize: '0.75rem' }}>&#x25B3;</span>
          </BoxVerticalHeader>
        </ClickableBoxComponent>
      )
    }
    return (
      <BoxComponent>
        { hideable && <BoxHeaderButton onClick={ this.handleClick }>x</BoxHeaderButton> }
        <BoxHeader>{ header }</BoxHeader>
        <BoxContent>
          { children }
        </BoxContent>
      </BoxComponent>
    )
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
      <Box header="details" position="top">
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
        <Box header="built using" position="bottom">
          <div>
            [
              <ExternalLink href="https://reactjs.org/">React</ExternalLink>,
              <ExternalLink href="https://github.com/stereobooster/react-snap">react-snap</ExternalLink>,
              <ExternalLink href="https://styled-components.com">styled-components</ExternalLink>,<br/>
              <ExternalLink href="https://github.com/rickycook/CV/actions">GitHub Actions</ExternalLink>,
              <ExternalLink href="https://pages.github.com">GitHub Pages</ExternalLink>
            ]
          </div>
        </Box>
      </ScreenOnly>
    )
  }
}
