import { contacts } from '../contacts';
import { Header3, SubHeader } from './Header';
import { List, ListItem } from './List';

const Reference = ({
  name,
  title,
  company,
  description,
}: {
  name: string;
  title: string;
  company: string;
  description: string;
}) => {
  const renderContact = (field: 'phone' | 'email') => {
    const contact = contacts?.[name];
    if (contact && !contact[field]) {
      return null;
    }
    return (
      <div>
        <span className="font-display mr-[10px] inline-block">{field}</span>{' '}
        {contact ? contact[field] : 'Contact for info'}
      </div>
    );
  };
  return (
    <>
      <Header3 type="secondary">{name}</Header3>
      <SubHeader type="secondary">
        {title} <span className="text-primary">@</span> {company}
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
