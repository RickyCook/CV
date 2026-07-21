import { LazyMotion, MotionConfig } from 'motion/react';
import type { ComponentProps } from 'react';

import { App } from './App';

type Features = ComponentProps<typeof LazyMotion>['features'];

export const Root = ({ features }: { features: Features }) => (
  <LazyMotion features={features}>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </LazyMotion>
);
