import type { ReactNode } from 'react';

export const List = ({ children }: { children: ReactNode }) => (
  <ul className="list-none p-0 m-0">{children}</ul>
);

export const ListItem = ({ children }: { children: ReactNode }) => (
  <li className="p-0 mb-[10px]">{children}</li>
);
