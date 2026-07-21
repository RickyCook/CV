import type { CSSProperties, ReactNode } from 'react';

interface MediaProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const PrintOnly = ({ children, className, style }: MediaProps) => (
  <span className={`hidden print:inline ${className ?? ''}`} style={style}>
    {children}
  </span>
);

export const ScreenOnly = ({ children, className, style }: MediaProps) => (
  <span className={`print:hidden ${className ?? ''}`} style={style}>
    {children}
  </span>
);
