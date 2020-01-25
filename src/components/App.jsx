import React from 'react';
import styled from 'styled-components/macro';

import { Contact } from './Contact';
import { Education } from './Education';
import { EmploymentHistory } from './EmploymentHistory';
import { BodyHeader, Header2 } from './Header';
import { References } from './References';

const ObjectivesWrapper = styled.p`
  @media print {
    padding-right: 230px
  }
`


export const App = props => (
  <React.Fragment>
    <BodyHeader trail={ true }>ricky cook</BodyHeader>
    <Contact />
    <Header2>objectives</Header2>
    <ObjectivesWrapper>
      I'm a self-confessed and passionate technologist and geek. I love working
      with technology to see how far it can be pushed. I try to keep up with as
      many new things that are happening in the tech sphere as I can, both in my
      professional life and for personal projects in my down time. I'm looking for
      a career that will allow me to explore opportunities to implement and design
      new and interesting solutions to issues that developers face every day;
      particularly around deployment, and automation.
    </ObjectivesWrapper>
    <Header2>code skills</Header2>
    <p>
      The core skillset that I've been using for the past 3 years has been centred
      around Python, Docker, Puppet, and AWS. Prior to this, my main competencies
      were a combination of Perl, PHP, and Java with a variety of frameworks in
      all. Most of my experiences lie with both software, and platform back-end
      specifics of componentized RESTful services, though I have also been involved
      with UI maintenance using Knockout, and React.
    </p>
    <Header2>application skills</Header2>
    <p>
      I am a competent and passionate Linux user, with a solid knowledge of Arch
      Linux for the desktop, as well as Debian, and RHEL on servers. I feel
      comfortable around all of the *nix OS flavours that I've been faced with.
      Over the past years, I have been exposed to some truly amazing technologies. Of
      particular note are Docker (and raw LXC/AuFS at a lower level), ElasticSearch,
      Gunicorn and PostGIS. These have proven an enormous boon to the projects that
      have implemented them.
    </p>
    <Header2>employment history</Header2>
    <EmploymentHistory />
    <Header2>education</Header2>
    <Education />
    <Header2>references</Header2>
    <References />
  </React.Fragment>
)
