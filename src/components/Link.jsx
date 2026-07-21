import { createContext, useContext, useEffect, useState } from 'react';

import { PrintOnly } from './Media';

export const ExternalLink = ({ children, ...props }) => (
  <a rel="noopener noreferrer" target="_blank" {...props}>
    {children}
  </a>
);

const tracker = {
  tracked: [],
  listeners: [],
  getIdx(url) {
    return this.tracked.findIndex(({ url: thisUrl }) => thisUrl === url);
  },
  _getNew(url) {
    const last = this.tracked[this.tracked.length - 1];
    const id = last ? last.id + 1 : 1;
    return { url, id, count: 0 };
  },
  get(url) {
    const idx = this.getIdx(url);
    return idx === -1 ? this._getNew(url) : this.tracked[idx];
  },
  exists(url) {
    return this.getIdx(url) !== -1;
  },
  add(url, notifyChanges = true) {
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
  remove(url, notifyChanges = true) {
    const idx = this.getIdx(url);
    if (idx === -1) {
      return;
    }
    const found = this.tracked[idx];
    found.count -= 1;

    if (notifyChanges) {
      this._notifyChanges();
    }
  },
  replace(oldUrl, newUrl) {
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
  addListener(func) {
    this.listeners.push(func);
  },
  removeListener(func) {
    const idx = this.listeners.indexOf(func);
    if (idx === -1) {
      return;
    }
    this.listeners.splice(idx, 1);
  },
};

const ReferencesContext = createContext(tracker);

const PrintReferences = () => {
  const context = useContext(ReferencesContext);
  const [links, setLinks] = useState([]);
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

const ReferenceLink = ({ href, ...rest }) => {
  const context = useContext(ReferencesContext);
  const [id, setId] = useState(null);
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
