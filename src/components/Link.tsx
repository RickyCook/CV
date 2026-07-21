import { createContext, useContext, useEffect, useState } from 'react';

import { PrintOnly } from './Media';

export const ExternalLink = ({
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a rel="noopener noreferrer" target="_blank" {...props}>
    {children}
  </a>
);

interface TrackedLink {
  url: string;
  id: number;
  count: number;
}

interface LinkTracker {
  tracked: TrackedLink[];
  listeners: Array<() => void>;
  getIdx(url: string): number;
  _getNew(url: string): TrackedLink;
  get(url: string): TrackedLink;
  exists(url: string): boolean;
  add(url: string, notifyChanges?: boolean): number;
  remove(url: string, notifyChanges?: boolean): void;
  replace(oldUrl: string, newUrl: string): number;
  _notifyChanges(): void;
  addListener(func: () => void): void;
  removeListener(func: () => void): void;
}

const tracker: LinkTracker = {
  tracked: [],
  listeners: [],
  getIdx(url: string) {
    return this.tracked.findIndex(({ url: thisUrl }) => thisUrl === url);
  },
  _getNew(url: string) {
    const last = this.tracked[this.tracked.length - 1];
    const id = last ? last.id + 1 : 1;
    return { url, id, count: 0 };
  },
  get(url: string) {
    const found = this.tracked.find(({ url: thisUrl }) => thisUrl === url);
    return found ?? this._getNew(url);
  },
  exists(url: string) {
    return this.getIdx(url) !== -1;
  },
  add(url: string, notifyChanges = true) {
    const found = this.get(url);
    if (found.count <= 0) {
      this.tracked.push(found);
    }
    found.count += 1;

    if (notifyChanges) {
      this._notifyChanges();
    }

    return found.id;
  },
  remove(url: string, notifyChanges = true) {
    const found = this.tracked.find(({ url: thisUrl }) => thisUrl === url);
    if (!found) {
      return;
    }
    const idx = this.tracked.indexOf(found);
    this.tracked.splice(idx, 1);
    found.count -= 1;

    if (notifyChanges) {
      this._notifyChanges();
    }
  },
  replace(oldUrl: string, newUrl: string) {
    this.remove(oldUrl, false);
    const id = this.add(newUrl, false);
    this._notifyChanges();
    return id;
  },

  _notifyChanges() {
    for (const func of this.listeners) {
      func();
    }
  },
  addListener(func: () => void) {
    this.listeners.push(func);
  },
  removeListener(func: () => void) {
    const idx = this.listeners.indexOf(func);
    if (idx === -1) {
      return;
    }
    this.listeners.splice(idx, 1);
  },
};

const ReferencesContext = createContext<LinkTracker>(tracker);

const PrintReferences = () => {
  const context = useContext(ReferencesContext);
  const [links, setLinks] = useState<TrackedLink[]>([]);
  useEffect(() => {
    const handler = () => setLinks(context.tracked);
    context.addListener(handler);
    setLinks(context.tracked);
    return () => {
      context.removeListener(handler);
    };
  }, [context]);
  return (
    <>
      {links.map((link) => (
        <div key={link.id}>
          [{link.id}]: {link.url}
        </div>
      ))}
    </>
  );
};

const ReferenceLink = ({
  href,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => {
  const context = useContext(ReferencesContext);
  const [id, setId] = useState<number | null>(null);
  useEffect(() => {
    setId(context.add(href));
    return () => {
      context.remove(href);
    };
  }, [context, href]);
  return (
    <>
      <ExternalLink href={href} {...rest} />
      <PrintOnly>[{id}]</PrintOnly>
    </>
  );
};

export { PrintReferences, ReferenceLink };
