import { m } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import { contacts } from '../contacts';
import { boxBodyProps, boxTabProps } from '../lib/anim';
import { ExternalLink } from './Link';
import { PrintOnly, ScreenOnly } from './Media';

const CONTACT_ME = contacts?.['Ricky Cook'];

const boxClass = {
  top: 'shadow-brutal-glow bg-[rgba(20,20,25,0.8)] fixed top-0 right-0 print:absolute',
  bottom: 'shadow-brutal-glow bg-[rgba(20,20,25,0.8)] fixed bottom-0 right-0 print:absolute',
} as const;
const clickableClass = {
  top: `${boxClass.top} bg-secondary cursor-pointer transition-colors duration-100 hover:bg-secondary-light`,
  bottom: `${boxClass.bottom} bg-secondary cursor-pointer transition-colors duration-100 hover:bg-secondary-light`,
} as const;

const boxHeaderTv =
  (base: string): ((type?: 'primary' | 'secondary' | 'plain') => string) =>
  (type = 'primary') => {
    const variants = {
      primary: 'text-background bg-primary',
      secondary: 'text-text bg-secondary',
      plain: 'text-text bg-transparent',
    };
    return `${base} ${variants[type]}`;
  };

const headerClass = boxHeaderTv('font-display font-bold flex-grow p-[11px] pl-[10px]');
const headerButtonClass =
  'font-display text-background border-0 flex place-items-center cursor-pointer h-full px-[11px] hover:bg-primary-dark transition-colors duration-100 [text-shadow:1px_1px_0_var(--color-primary-dark)]';
const verticalHeaderClass =
  'font-display text-text [writing-mode:vertical-rl] [text-orientation:sideways]';

type BoxPosition = 'top' | 'bottom';

const BoxBody = ({
  boxShown,
  children,
  header,
  onClose,
  position,
}: {
  boxShown: boolean | null;
  children: React.ReactNode;
  header: React.ReactNode;
  onClose: () => void;
  position: BoxPosition;
}) => {
  const shown = boxShown !== false;
  return (
    <m.aside
      aria-hidden={!shown}
      className={`whitespace-nowrap ${boxClass[position]}`}
      {...boxBodyProps(shown)}
    >
      <div className="flex items-stretch h-[50px] bg-header-primary border-b-[3px] border-black">
        <div className={headerClass(undefined)}>{header}</div>
        <ScreenOnly>
          <button type="button" onClick={onClose} className={headerButtonClass}>
            x
          </button>
        </ScreenOnly>
      </div>
      <div className="text-[0.75em] p-[15px]">{children}</div>
    </m.aside>
  );
};

const BoxExpander = ({
  boxShown,
  header,
  onClick,
  position,
}: {
  boxShown: boolean | null;
  header: React.ReactNode;
  onClick: () => void;
  position: BoxPosition;
}) => {
  const shown = !boxShown;
  return (
    <ScreenOnly>
      <m.div
        aria-hidden={!shown}
        onClick={onClick}
        className={clickableClass[position]}
        {...boxTabProps(shown)}
      >
        <div className={`${verticalHeaderClass} text-[0.75em] px-[15px] py-[10px]`}>
          {header} <span style={{ fontSize: '0.75rem' }}>&#x25B3;</span>
        </div>
      </m.div>
    </ScreenOnly>
  );
};

const Box = ({
  header,
  position,
  children,
}: {
  header: React.ReactNode;
  position: BoxPosition;
  children: React.ReactNode;
}) => {
  // Render expanded on the server (and wide screens); collapsible after hydration
  const getDefaultShow = useCallback(
    () => typeof window === 'undefined' || !(window.innerWidth < 1500),
    [],
  );
  const [defaultShow, setDefaultShow] = useState<boolean>(getDefaultShow());
  const [userShow, setUserShow] = useState<boolean | undefined>(undefined);
  const show = userShow ?? defaultShow;

  const handleResize = useCallback(() => {
    setDefaultShow(getDefaultShow());
  }, [getDefaultShow]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
  const handleExpandClick = useCallback(() => setUserShow(true), []);
  const handleBodyClose = useCallback(() => setUserShow(false), []);

  return (
    <>
      <BoxExpander
        boxShown={show}
        header={header}
        position={position}
        onClick={handleExpandClick}
      />
      <BoxBody boxShown={show} header={header} position={position} onClose={handleBodyClose}>
        {children}
      </BoxBody>
    </>
  );
};

const DetailsItemScreen = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <span className="font-display bg-secondary py-[7.5px] px-[15px] -ml-[15px] mr-[10px] inline-block">
      {label}
    </span>
    {children}
  </div>
);

const DetailsItemPrint = ({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) => (
  <div>
    {label ? <div className="font-bold">{label}</div> : <div aria-hidden>&nbsp;</div>}
    <div>{children}</div>
  </div>
);

export const Details = () => (
  <>
    <ScreenOnly>
      <Box header="Details" position="top">
        <DetailsItemScreen label="phone">{CONTACT_ME?.phone || 'Contact for info'}</DetailsItemScreen>
        <DetailsItemScreen label="email">
          {CONTACT_ME?.email ? (
            <ExternalLink href={`mailto:${CONTACT_ME.email}`}>{CONTACT_ME.email}</ExternalLink>
          ) : (
            'Contact for info'
          )}
        </DetailsItemScreen>
        <div className="pt-[7.5px]">
          <ExternalLink href="https://github.com/rickycook/CV">rickycook/CV</ExternalLink>
        </div>
      </Box>
    </ScreenOnly>
    <PrintOnly>
      <div className="mt-[15px] inline-flex gap-x-[10px]">
        <DetailsItemPrint label="phone">{CONTACT_ME?.phone || 'Contact for info'}</DetailsItemPrint>
        <span aria-hidden className="w-0 border-l-2 border-current self-stretch" />
        <DetailsItemPrint label="email">
          {CONTACT_ME?.email ? (
            <ExternalLink href={`mailto:${CONTACT_ME.email}`}>{CONTACT_ME.email}</ExternalLink>
          ) : (
            'Contact for info'
          )}
        </DetailsItemPrint>
        <span aria-hidden className="w-0 border-l-2 border-current self-stretch" />
        <DetailsItemPrint label="web">
          <ExternalLink href="https://thatpanda.com">thatpanda.com</ExternalLink>
        </DetailsItemPrint>
        <span aria-hidden className="w-0 border-l-2 border-current self-stretch" />
        <DetailsItemPrint>
          <ExternalLink href="https://github.com/rickycook/CV">
            github.com/rickycook/CV
          </ExternalLink>
        </DetailsItemPrint>
      </div>
    </PrintOnly>
  </>
);

export const BuildInfo = () => (
  <ScreenOnly>
    <Box header="Built Using" position="bottom">
      <div>
        [<ExternalLink href="https://reactjs.org/">React</ExternalLink>,
        <ExternalLink href="https://tailwindcss.com">Tailwind CSS</ExternalLink>,
        <br />
        <ExternalLink href="https://workers.cloudflare.com/">CloudFlare Workers</ExternalLink>,
        <ExternalLink href="https://pages.cloudflare.com/">CloudFlare Pages</ExternalLink>]
      </div>
    </Box>
  </ScreenOnly>
);
