import React, { Fragment, PureComponent } from 'react';
import styled from 'styled-components/macro';

import { contacts } from '../contacts';
import * as Header from './Header';
import { List, ListItem } from './List';

const { Header3, SubHeader } = Header;


const Highlight = styled.span`
  color: ${props => props.theme.primary};
`
const ReferenceLabel = styled.span`
  ${Header.fontStyle}
  margin-right: ${props => props.theme.spacer}px;
  display: inline-block;
`


class Reference extends PureComponent {
  renderContact = field => {
    const contact = contacts && contacts[this.props.name]
    if (contact && !contact[field]) {
      return null;
    }
    return <div><ReferenceLabel>{ field }</ReferenceLabel> { contact ? contact[field] : 'Contact for info' }</div>
  }
  render() {
    const { name, title, company, description } = this.props
    return (
      <Fragment>
        <Header3 type="secondary">{ name }</Header3>
        <SubHeader type="secondary">{ title } <Highlight>@</Highlight> { company }</SubHeader>
        <p>{ description }</p>
        { this.renderContact('phone') }
        { this.renderContact('email') }
      </Fragment>
    );
  }
}


export class References extends PureComponent {
  render() {
    return (
      <List>
        <ListItem>
          <Reference
            name="Damien Whitten"
            title="Senior DevOps Engineer"
            company="dutyof.care"
            description="Damien and I worked together to build dutyof.care"
          />
        </ListItem>
        <ListItem>
          <Reference
            name="Liam Mann"
            title="Senior Project Manager"
            company="Blue Bike Solutions"
            description="Liam managed some of my projects at Blue Bike Solutions"
          />
        </ListItem>
      </List>
    )
  }
}
