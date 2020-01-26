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
      I love using technology to be a multiplier of human effort, especially when
      helping people pursue a cause for social good. I've spent the large
      majority of my career enabling all kinds of organizations achieve their
      social purpose, by ensuring that doctors are efficiently communicating,
      community services can provide accurate and timely help, ensuring developers
      can iterate and deliver quickly, and helping organizations safeguard the
      vulnerable people in their care. All of these objectives have been achieved
      through a interesting mixes of both new, and "boring" technology. I'd like
      to continue working to multiply the effectiveness of causes that I believe in
      through my love of software.
    </ObjectivesWrapper>
    <Header2>code skills</Header2>
    <p>
      The core skillset that I've been using has been centred around Python,
      node.js, and React. I've also had prior experience with many
      other languages, and can pick up new Frameworks, infrastructure, and
      languages with ease. Most of my experience lie with both software, and
      infrastructure back-end specifics of either monolithic, or microservice-based
      RESTful services. I am also a competent front-end developer, and have
      created UIs that are in every day use by end-users.
    </p>
    <Header2>infrastructure skills</Header2>
    <p>
      I am a passionate Linux user, and though I currently use MacOS for my
      development environment, I am well versed in using Linux for every day
      desktop tasks as well as using both Docker, and Virtualized Linux almost
      every day. I always focus on getting security right, and building on top of
      a solid foundation of infrastructure on any variant of *nix that is required.
    </p>
    <p>
      Other technologies I've had every-day use of include AWS (EC2, EKS, RDS,
      CloudFormation, Lambda, etc), ElasticSearch, PostgreSQL/PostGIS, and
      Kubernetes. I've also had experience with many more infrastructure
      automation and management tools not listed here; some of these are listed
      in my employment history below.
    </p>
    <Header2>employment history</Header2>
    <EmploymentHistory />
    <Header2>education</Header2>
    <Education />
    <Header2>references</Header2>
    <References />
  </React.Fragment>
)
