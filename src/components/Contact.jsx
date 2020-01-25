import React, { PureComponent } from 'react';
import styled from 'styled-components/macro';

import * as Header from './Header';
import { PrintOnly, ScreenOnly } from './Media'


/* global CONTACTS */
const CONTACT_ME = CONTACTS && CONTACTS['Ricky Cook'];


const Box = styled.div`
  background-color: rgba(20,20,25,0.8);
  position: fixed;
  top: 0px;
  right: 0px;
  padding: ${props => props.theme.bodyMargin}px;

  @media print {
    position: absolute;
  }
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


export class Contact extends PureComponent {
  render() {
    return (
      <Box>
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
          <BoxRow>
            <ExternalLink href="https://github.com/rickycook/CV">
              <PrintOnly>github.com/rickycook/CV</PrintOnly>
              <ScreenOnly>rickycook/CV</ScreenOnly>
            </ExternalLink>
          </BoxRow>
        </BoxContent>
      </Box>
    )
  }
}
