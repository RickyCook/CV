import _ from 'lodash';
import React, { Component, Fragment, PureComponent } from 'react';
import styled from 'styled-components/macro';

import { Button } from './Button';
import { Header3, Header4, SubHeader } from './Header';
import { List, ListItem } from './List';
import { ScreenOnly } from './Media';


const JobShowButtonWrapper = styled.div`
  margin: ${props => props.theme.spacer * 2}px 0px;
`


const MAX_JOBS_LIST = 2;


class JobsList extends PureComponent {
  state = {
    showMore: false,
  }
  renderShowButton = ({ showMore, text }) => {
    return (
      <JobShowButtonWrapper>
        <Button
          block={ true }
          type="secondary"
          onClick={ () => {
            this.setState({ showMore })
          } }
        >
          { text }
        </Button>
      </JobShowButtonWrapper>
    )
  }
  renderShowMore = () => {
    return this.renderShowButton({ showMore: true, text: 'Show more' })
  }
  renderShowLess = () => {
    return this.renderShowButton({ showMore: false, text: 'Show less' })
  }
  render() {
    const { showMore } = this.state;
    let jobsRendered = 0;
    return (
      <Fragment>
        <List>
          { React.Children.map(this.props.children, child => {
            if (React.isValidElement(child)) {
              jobsRendered++;
            }
            if (!showMore && jobsRendered > MAX_JOBS_LIST) {
              return null
            }
            return child
          }) }
        </List>
        <ScreenOnly>
          { jobsRendered > MAX_JOBS_LIST && !showMore && this.renderShowMore() }
          { showMore && this.renderShowLess() }
        </ScreenOnly>
      </Fragment>
    )
  }
}

const Highlight = styled.span`
  color: ${props => props.theme.primary};
`
const CompetenceWrapper = styled.span`
  color: ${props => props.theme.competence[props.name]}
`

class Competence extends PureComponent {
  render() {
    const { children, name } = this.props
    return <CompetenceWrapper name={ name }>{ children ? children : _.startCase(name) }</CompetenceWrapper>
  }
}

class TechnologyRow extends PureComponent {
  render() {
    const { competence, items } = this.props
    return (
      <div>
        <Competence name={ competence } />:&nbsp;
        { items.join(', ') }
      </div>
    )
  }
}

const JobContent = styled.div`
  display: flex;
  align-content: stretch;
`
const JobMainColumn = styled.div`
  flex-shrink: 1;
`
const JobRightColumn = styled.div`
  flex-shrink: 0;
  flex-basis: 200px;

  @media print {
    padding-left: ${prop => prop.theme.spacer}px;
  }
`
const JobRightContent = styled.div`
  padding-left: ${props => props.theme.spacer}px;

  @media print {
    padding: 0px;
  }
`

class Job extends Component {
  render() {
    const { achievements, company, fromdate, responsibilities, technologies, title, todate } = this.props;
    return (
      <Fragment>
        <Header3 type="secondary">{ title } <Highlight>@</Highlight> { company }</Header3>
        <SubHeader type="secondary">{ fromdate } - { todate }</SubHeader>
        <JobContent>
          <JobMainColumn>
            <Header4 type="plain">Responsibilities</Header4>
            <ul>
              { responsibilities.map(text => <li key={ text }>{ text }</li>) }
            </ul>
            <Header4 type="plain">Achievements</Header4>
            <ul>
              { achievements.map(text => <li key={ text }>{ text }</li>) }
            </ul>
          </JobMainColumn>
          <JobRightColumn>
            <Header4 type="plain">Technologies</Header4>
            <JobRightContent>
              { technologies.map(row => <TechnologyRow key={ row.competence } { ...row } />) }
            </JobRightContent>
          </JobRightColumn>
        </JobContent>
      </Fragment>
    )
  }
}


export class EmploymentHistory extends PureComponent {
  render() {
    return (
      <JobsList>
        <ListItem>
          <Job
            company="dutyof.care"
            title="Tech Lead"
            fromdate="September 2017"
            todate="Current"
            responsibilities={[
              `Create the dutyof.care platform, associated infrastructure,
              user experience, design many and build many product features`,

              `Ensure that the dutyof.care platform remains in operation,
              at a high level of performance`,

              `Collaborate with both technical, and non-technical customers
              to help them integrate the platform into their business either
              via software integrations, or additional features to aid in
              human interaction`,

              `Conduct employment interviews, and build a quality development
              team`,
            ]}
            achievements={[
              `The dutyof.care platform produces results to the 99th percentile
              of its validation requests, discluding latency of source
              databases, in less than 50ms`,

              `Stability of the platform is excellent. Very few single points
              of failure, and those that are singletons are not time-critical
              services, allowing recovery without users seeing downtime`,

              `Platforms security is excellent; Hashicorp Vault is used accross
              all services to ensure that secrets are time-limited where
              possible, and are at the very least highly controlled, and
              access is audited`
            ]}
            technologies={[
              {
                competence: 'great',
                items: ['Python', 'Docker', 'AWS', 'PostgreSQL', 'React', 'Kubernetes(EKS)', 'nodejs'],
              },
              {
                competence: 'good',
                items: ['SQLAlchemy', 'Flask', 'Hashicorp Vault', 'Hugo'],
              },
              {
                competence: 'competent',
                items: ['Lambda(AWS)', 'Prometheus', 'RabbitMQ'],
              },
            ]}
          />
        </ListItem>
        <ListItem>
          <Job
            company="Blue Bike Solutions"
            title="Senior Software Engineer"
            fromdate="April 2017"
            todate="September 2017"
            responsibilities={[
              `Create, and manage both software, and infrastructure
              soluctions for a variety of not-for-profit clients,
              mostly with limited budgets`,

              `Act as a technical resource to allow other consultants
              to design appropriate, achievable solutions`,
            ]}
            achievements={[
              `Developed a prototype app for the Australian Red Cross
              to aid in disaster relief  in developing countries. The
              end product showed how a light-weight app could sync an
              inventory database when offline, and allow search and
              update when out of connectivity`,

              `Moved a legacy, but important software product from a single
              dedicated server, to load-balanced, highly-available AWS
              architecture that ended up as good as a cloud-native solution`,
            ]}
            technologies={[
              {
                competence: 'great',
                items: ['Python', 'Docker', 'AWS', 'PostgreSQL', 'React', 'Flask'],
              },
              {
                competence: 'good',
                items: ['SQLAlchemy', 'Framework7'],
              },
              {
                competence: 'competent',
                items: ['Java', 'Domo'],
              },
            ]}
          />
        </ListItem>
        <ListItem>
          <Job
            company="Redbubble"
            title="DevOps Engineer"
            fromdate="September 2015"
            todate="March 2016"
            responsibilities={[
              `As part of the delivery engineering team, it was
              our job to "help teams deliver value faster",
              carefully balancing new technology and process
              with business demands to deliver features`,

              `Acted as the team's AWS, Docker, and general
              DevOps expert`,

              `Built a new Docker-based platform for very fast,
              and safe deployment of microservices`,
            ]}
            achievements={[
              `Reduced deployment time from 40min on the old
              platform, to less than 1min on the new`,

              `Built many tools for comparison-based
              testing of refactored services, similar to
              GitHub scientist [1]`,

              `Built an application platform that replaced
              unhealthy nodes with zero downtime for
              deployed services`,

              `Implemented a centralized logging stack to help
              diagnose issues across many disparate (including
              legacy) systems`,
            ]}
            technologies={[
              {
                competence: 'great',
                items: ['AWS', 'Docker', 'BuildKite', 'systemd', 'Debian'],
              },
              {
                competence: 'good',
                items: ['Ruby', 'Rails', 'Packer', 'Logstash', 'Kibana'],
              },
            ]}
          />
        </ListItem>
        <ListItem>
          <Job
            company="Odecee (Australia Post)"
            title="DevOps Engineer"
            fromdate="August 2014"
            todate="September 2015"
            responsibilities={[
              `Design, and implement CI, complex third party
              applications, and a PCI/DSS platform able to
              scale, heal, anddeploy consistently in AWS
              architecture`,

              `Guide the engineering direction of Python
              management framework to ease implementation of
              complex automation tooling`,
            ]}
            achievements={[
              `Nominated for an internal award for simplicity
              on a very complex project`,

              `Due to the architecture and design of the
              management tools I designed, adding new
              functions with complex inter-node interactions,
              mutexes, etc became very easy`,

              `Implemented a fully automated iOS build cluster
              using both Ansible, and existing Puppet
              manifests to build, and test iOS apps in the
              same way as existing RHEL server apps`,
            ]}
            technologies={[
              {
                competence: 'great',
                items: ['Python', 'AWS', 'Puppet', 'boto'],
              },
              {
                competence: 'good',
                items: ['Ansible', 'Bamboo', 'Consul', 'Stash', 'RHEL', 'XCode', 'Puppet'],
              },
            ]}
          />
        </ListItem>
        <ListItem>
          <Job
            company="Infoxchange"
            title="Web Applications Developer"
            fromdate="2012"
            todate="2014"
            responsibilities={[
              `Develop and debug complex web applications in
              environments with both legacy and cutting edge
              technology, using agile methods.`,

              `Judge and create releases as part of a CI/CD
              process, run retrospectives and generally
              participate in a highly flexible and free agile
              team.`,
            ]}
            achievements={[
              `Months before Docker was released, I was tasked
              with building a new CI server for the team. My
              solution was an LXC-based container system that
              used AuFS for the root file system and was
              managed by Puppet in the background. This set
              Infoxchange on a path to very quickly adopt
              Docker when it was released. I then did a talk
              on my solution at Infracoders Melbourne [2].`,

              `Played a vital role redeveloping Infoxchange's
              legacy search application from the ground up
              using Docker, ElasticSearch and Django. Again,
              this lead to a talk (that at time of writing
              has yet to be given) at the Melbourne Search
              user's group [3]`,
            ]}
            technologies={[
              {
                competence: 'great',
                items: ['Python', 'Django', 'ElasticSearch', 'jQuery', 'Perl'],
              },
              {
                competence: 'good',
                items: ['Docker', 'PostgreSQL', 'CSS3', 'HTML5', 'Debian'],
              },
              {
                competence: 'competent',
                items: ['LESS', 'YUI', 'Mojolicious', 'HHVM', 'Puppet'],
              },
            ]}
          />
        </ListItem>
      </JobsList>
    )
  }
}
