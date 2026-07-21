import { writeDelay } from '../lib/anim';
import { BuildInfo, Details } from './Boxes';
import { Education } from './Education';
import { EmploymentHistory } from './EmploymentHistory';
import { BodyHeader, Header2 } from './Header';
import { PrintReferences } from './Link';
import { PrintOnly } from './Media';
import { References } from './References';
import { Reveal } from './Reveal';

export const App = () => (
  <>
    <BodyHeader trail={true} writeDelay={0}>
      Ricky Cook
    </BodyHeader>
    <Details />
    <Reveal index={0}>
      <Header2 writeDelay={writeDelay(0)}>Objectives</Header2>
      <p className="print:pr-[230px]">
        I love using technology to be a multiplier of human effort, especially when helping people
        pursue a cause for social good. I've spent the large majority of my career enabling all
        kinds of organizations achieve their social purpose, by ensuring that doctors are
        efficiently communicating, community services can provide accurate and timely help, ensuring
        developers can iterate and deliver quickly, and helping organizations safeguard the
        vulnerable people in their care. All of these objectives have been achieved through
        interesting mixes of both new and "boring" technology. I'd like to continue working to
        multiply the effectiveness of causes that I believe in through my love of software.
      </p>
    </Reveal>
    <Reveal index={1}>
      <Header2 writeDelay={writeDelay(1)}>Code Skills</Header2>
      <p>
        The core skillset that I've been using has been centred around Python, TypeScript, and
        React. I've also had prior experience with many other languages, and can pick up new
        frameworks, infrastructure, and languages with ease. Most of my experience lie with both
        software, and infrastructure back-end specifics of either monolithic, or microservice-based
        RESTful services. I am also a competent front-end developer, and have created UIs that are
        in every day use by end-users.
      </p>
    </Reveal>
    <Reveal index={2}>
      <Header2 writeDelay={writeDelay(2)}>Infrastructure Skills</Header2>
      <p>
        I am a passionate Linux user, and though I currently use MacOS for my development
        environment, I am well versed in using Linux for every day desktop tasks as well as using
        both Docker, and Virtualized Linux almost every day. I always focus on getting security
        right, and building on top of a solid foundation of infrastructure on any variant of *nix
        that is required.
      </p>
      <p>
        Other technologies I've had every-day use of include AWS (EC2, EKS, RDS, CloudFormation,
        CDK, Lambda and most serverless tools, etc), GitHub Actions, and Kubernetes. I've also had
        experience with many more infrastructure automation and management tools not listed here;
        some of these are listed in my employment history below.
      </p>
    </Reveal>
    <Reveal index={3}>
      <Header2 writeDelay={writeDelay(3)}>Employment History</Header2>
      <EmploymentHistory />
    </Reveal>
    <Reveal index={4}>
      <Header2 writeDelay={writeDelay(4)}>Education</Header2>
      <Education />
    </Reveal>
    <Reveal index={5}>
      <Header2 writeDelay={writeDelay(5)}>References</Header2>
      <References />
    </Reveal>
    <PrintOnly>
      <hr />
      <PrintReferences />
    </PrintOnly>
    <BuildInfo />
  </>
);
