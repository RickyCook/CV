import { m } from 'motion/react';
import type { ReactNode } from 'react';

import { showProps } from '../lib/anim';

export const Reveal = ({ children, index }: { children: ReactNode; index: number }) => (
  <m.div {...showProps(index)}>{children}</m.div>
);
