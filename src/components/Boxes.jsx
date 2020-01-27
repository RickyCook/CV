import _ from 'lodash';
import React, { Fragment, PureComponent } from 'react';
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

    let Component
    switch(position) {
    case 'top':
      Component = TopBox;
      break;
    case 'bottom':
      Component = BottomBox;
      break;
    default:
      throw new Error('Invalid position option');
    }
    return (
      <BoxBodyWrapper show={ boxShown }>
        <Component>
          { hideable && (
            <ScreenOnly>
              <BoxHeaderButton onClick={ onClose }>x</BoxHeaderButton>
            </ScreenOnly>
          ) }
          <BoxHeader>{ header }</BoxHeader>
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

    let Component
    switch(position) {
    case 'top':
      Component = TopBoxClickable;
      break;
    case 'bottom':
      Component = BottomBoxClickable;
      break;
    default:
      throw new Error('Invalid position option');
    }
    return (
      <ScreenOnly style={{ display: boxShown ? 'none' : undefined }}>
        {/* maxWidth is a hack for FF rendering/hydration issue */}
        <Component onClick={ onClick } style={{ maxWidth: '25px' }}>
          <BoxVerticalHeader>
            { header } <span style={{ fontSize: '0.75rem' }}>&#x25B3;</span>
          </BoxVerticalHeader>
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
