import { PrintOnly } from './Media';

const links = [
  'http://www.meetup.com/Infrastructure-Coders/events/127899532/',
  'https://github.com/github/scientist',
  'http://www.meetup.com/melbourne-search/events/187267272/',
] as const;

export const ExternalLink = ({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a rel="noopener noreferrer" target="_blank" {...props}>
    {children}
  </a>
);

const PrintReferences = () => {
  return (
    <>
      {links.map((link, idx) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: links is static
        <div key={idx}>
          [{idx + 1}]: {link}
        </div>
      ))}
    </>
  );
};

const ReferenceLink = ({
  href,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: (typeof links)[number] }) => {
  const idx = links.indexOf(href);
  return (
    <>
      <ExternalLink href={href} {...rest} />
      <PrintOnly>[{idx + 1}]</PrintOnly>
    </>
  );
};

export { PrintReferences, ReferenceLink };
