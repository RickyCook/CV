import _ from 'lodash';
import React, { Component, Fragment, PureComponent } from 'react';
import styled from 'styled-components/macro';

import { Button } from './Button';
import { Header3, Header4, SubHeader } from './Header';
import { ReferenceLink } from './Link';
import { List, ListItem } from './List';
import { PrintOnly, ScreenOnly } from './Media';


const JobShowButtonWrapper = styled.div`
  margin: ${props => props.theme.spacer * 2}px 0px;
`


const MAX_JOBS_LIST = 3;


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
              return <div style={{ display: 'none' }}>{ child }</div>
            }
            return child
          }) }
        </List>
        { jobsRendered > MAX_JOBS_LIST && (
          <Fragment>
            <ScreenOnly>
              { showMore ? this.renderShowLess() : this.renderShowMore() }
            </ScreenOnly>
            { !showMore && <PrintOnly><p><em>More employment history available on request, or at thatpanda.com</em></p></PrintOnly> }
          </Fragment>
        ) }
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

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: auto 250px;
  grid-template-areas:
    "responsibilities technologies"
    "achievements technologies"
  ;
  @media (max-width: 720px) {
    grid-template-columns: auto;
    grid-template-areas:
      "responsibilities"
      "achievements"
      "technologies"
    ;
  }
`
const JobRow = styled.div`
`
const TechnologiesJobRow = styled(JobRow)`
  padding-left: ${props => props.theme.spacer * 2}px;
  @media (max-width: 720px) {
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
        <JobGrid>
          <JobRow style={{ gridArea: 'responsibilities' }}>
            <Header4 type="plain">Responsibilities</Header4>
            <ul>
              { responsibilities.map(text => <li key={ text }>{ text }</li>) }
            </ul>
          </JobRow>
          <JobRow style={{ gridArea: 'achievements' }}>
            <Header4 type="plain">Achievements</Header4>
            <ul>
              { achievements.map(text => <li key={ text }>{ text }</li>) }
            </ul>
          </JobRow>
          <TechnologiesJobRow style={{ gridArea: 'technologies' }}>
            <Header4 type="plain">Technologies</Header4>
            { technologies.map(row => <TechnologyRow key={ row.competence } { ...row } />) }
          </TechnologiesJobRow>
        </JobGrid>
      </Fragment>
    )
  }
}


export class EmploymentHistory extends PureComponent {
  render() {
    return (
      <Fragment>
        <Header3 type="secondary">Highlights</Header3>
        <ul>
          <li><em>Mantel Group</em>: Led many complex projects from migrating applications onto AWS infrastructure, to developing server and Blockchain applications from scratch</li>
          <li><em>dutyof.care</em>: Developed the dutyof.care platform, from scratch into a highly scalable, resilient, fast product</li>
          <li><em>Redbubble</em>: AWS and Docker SME on the team tasked with moving to containers, and AWS</li>
          <li><em>Odecee</em>: Helped implement a PCI-compliant, continuous-deployment environment on AWS</li>
          <li><em>Odecee</em>: Nominated for an internal award for simplicity on a complex project</li>
          <li><em>Infoxchange</em>: Before Docker, implemented a containerised build system using LXC, auFS, and Puppet. I then presented the solution in a talk at <ReferenceLink href="http://www.meetup.com/Infrastructure-Coders/events/127899532/">Infracoders Melbourne</ReferenceLink></li>
        </ul>
        <JobsList>
         <ListItem>
            <Job
              company="Mantel Group"
              title="Lead Engineer"
              fromdate="March 2020"
              todate="Current"
              responsibilities={[
                `Plan complex projects when clients are mostly aware of only
                timelines, and high-level requirements`

                `Lead project teams consisting of internal and client staff to
                define Agile processes that help build a high functioning team`,

                `Solve complex technical problems as the come up - most projects
                assigned to me were in new and emerging technologies without
                many pre-existing solutions to problems`,
              ]}
              achievements={[
                `Migrated a high-profile DNS registry (not registrar) from
                on-premises infrastructure to AWS. The scope of the change made
                this the largest of its kind in the world, which introduced many
                unique AWS challenges`,

                `Infrastructure engineer for a high profile government initiative
                implemented using majority serverless technologies and supporting
                a high volume of traffic. This project introduced some novel new
                deployment and application patterns combining CDK, TypeScript,
                and Rush`,

                `Sole developer of a blockchain-based POC for a new startup that
                used serverless technologies to ensure the business wasn't spending
                money when it wasn't yet funded`,
              ]}
              technologies={[
                {
                  competence: 'great',
                  items: ['AWS - General', 'Lambda(AWS)', 'AppSync(AWS)', 'API Gateway(AWS)', 'CDK(AWS)', 'Kubernetes/EKS(AWS)', 'CDK(AWS)', 'GitHub Actions', 'React', 'TypeScript', 'Python'],
                },
                {
                  competence: 'good',
                  items: ['Rush', 'DynamoDB(AWS)', 'EC2 Image Builder(AWS)', 'Cognito(AWS)', 'Ethereum'],
                },
                {
                  competence: 'competent',
                  items: ['Terraform', 'Marketplace(AWS)'],
                },
              ]}
            />
          </ListItem>
          <ListItem>
            <Job
              company="dutyof.care"
              title="Tech Lead"
              fromdate="September 2017"
              todate="March 2020"
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

                <Fragment>
                  Built many tools for comparison-based testing of refactored services, similar to <ReferenceLink href="https://github.com/github/scientist">GitHub scientist</ReferenceLink>
                </Fragment>,

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

                `Selected to work on the "Trusted Services Cloud"
                project; A sophisticated build of a PCI compliant,
                highly automated AWS environment. My main
                achievement was the deployment automation of the
                IDP suite that protected every server in the
                whole environment`,

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
                <Fragment>
                  Months before Docker was released, I was tasked with building a new CI server for the team. My solution was an LXC-based container system that used AuFS for the root file system and was managed by Puppet in the background. This set Infoxchange on a path to very quickly adopt Docker when it was released. I then did a talk on my solution at <ReferenceLink href="http://www.meetup.com/Infrastructure-Coders/events/127899532/">Infracoders Melbourne</ReferenceLink>
                </Fragment>,

                <Fragment>
                  Played a vital role redeveloping Infoxchange's legacy search application from the ground up using Docker, ElasticSearch and Django. Again, this lead to a talk at the <ReferenceLink href="http://www.meetup.com/melbourne-search/events/187267272/">Melbourne Search user's group</ReferenceLink>
                </Fragment>,
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
      </Fragment>
    )
  }
}
