import React, { Fragment, PureComponent } from 'react';

import { Header3, SubHeader } from './Header'
import { List, ListItem } from './List'


class EducationItem extends PureComponent {
  render() {
    const { description, institution, title, complete, fromdate, todate } = this.props
    return (
      <Fragment>
        <Header3 type="secondary">{ institution }, { fromdate } - { todate }</Header3>
        <SubHeader type="secondary">{ title } { !complete && '[Incomplete]' }</SubHeader>
        <p>{ description }</p>
      </Fragment>
    );
  }
}


export class Education extends PureComponent {
  render() {
    return (
      <List>
        <ListItem>
          <EducationItem
            institution="Swinburne University of Technology"
            title="Bachelor of Science (Computer Science and Software Engineering) / Bachelor of Multimedia (Games and Interactivity)"
            complete={ false }
            fromdate="2008"
            todate="2009"
            description={
              `This course gave me a stable footing in systems design,
              usability design, Java programming, C and C++ programming,
              3D modeling and various other facets of the game
              development profession. I left to pursue take a job offer
              to work in professional software development.`
            }
          />
        </ListItem>
      </List>
    )
  }
}
