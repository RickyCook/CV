import React, { PureComponent } from 'react';
import styled from 'styled-components/macro';

import { contacts } from '../contacts'
import * as Header from './Header';
import { PrintOnly, ScreenOnly } from './Media'


const CONTACT_ME = contacts && contacts['Ricky Cook'];


const Box = styled.div`
  background-color: rgba(20,20,25,0.8);
  position: fixed;
  right: 0px;
  padding: ${props => props.theme.bodyMargin}px;

  @media print {
    position: absolute;
  }
`
const TopBox = styled(Box)`
  top: 0px;
`
const BottomBox = styled(Box)`
  position: fixed;
  bottom: 0px;
`
const BoxHeader = styled.div`
  ${Header.fontStyle}
  margin-bottom: ${props => props.theme.spacer}px;
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


export class Details extends PureComponent {
  render() {
    return (
      <TopBox>
        <BoxHeader>details</BoxHeader>
        <BoxContent>
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
        </BoxContent>
      </TopBox>
    )
  }
}

export class BuildInfo extends PureComponent {
  render() {
    return (
      <ScreenOnly>
        <BottomBox>
          <BoxHeader>built using</BoxHeader>
          <BoxContent>
            <div>
              [
                <ExternalLink href="https://reactjs.org/">React</ExternalLink>,
                <ExternalLink href="https://github.com/stereobooster/react-snap">react-snap</ExternalLink>,
                <ExternalLink href="https://styled-components.com">styled-components</ExternalLink>,<br/>
                <ExternalLink href="https://github.com/rickycook/CV/actions">GitHub Actions</ExternalLink>,
                <ExternalLink href="https://pages.github.com">GitHub Pages</ExternalLink>
              ]
            </div>
          </BoxContent>
        </BottomBox>
      </ScreenOnly>
    )
  }
}
