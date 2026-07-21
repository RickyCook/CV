import styled from 'styled-components';

import { contacts } from '../contacts';
import * as Header from './Header';
import { List, ListItem } from './List';

const { Header3, SubHeader } = Header;

const Highlight = styled.span`
  color: ${(props) => props.theme.primary};
`;
const ReferenceLabel = styled.span`
  ${Header.fontStyle}
  margin-right: ${(props) => props.theme.spacer}px;
  display: inline-block;
`;

const Reference = ({ name, title, company, description }) => {
  const renderContact = (field) => {
    const contact = contacts?.[name];
    if (contact && !contact[field]) {
      return null;
    }
    return (
      <div>
        <ReferenceLabel>{field}</ReferenceLabel> {contact ? contact[field] : 'Contact for info'}
      </div>
    );
  };
  return (
    <>
      <Header3 type="secondary">{name}</Header3>
      <SubHeader type="secondary">
        {title} <Highlight>@</Highlight> {company}
      </SubHeader>
      <p>{description}</p>
      {renderContact('phone')}
      {renderContact('email')}
    </>
  );
};

export const References = () => (
  <List>
    <ListItem>
      <Reference
        name="Damien Whitten"
        title="CTO"
        company="Interchange"
        description="Damien and I worked together to build dutyof.care, and Interchange"
      />
    </ListItem>
    <ListItem>
      <Reference
        name="Ross Williamson"
        title="Lead Engineer"
        company="Mantel Group"
        description="Ross was my people guide at Mantel Group. He was privy to all feedback and performance reviews"
      />
    </ListItem>
  </List>
);
