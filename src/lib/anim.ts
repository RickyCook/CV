import type { Transition } from 'motion/react';
import { Children, isValidElement, type ReactNode } from 'react';

const ANIM = {
  stagger: 0.1,
  showDuration: 0.4,
  writeDuration: 0.2,
} as const;

export type Variant = 'primary' | 'secondary' | 'plain';

export const showDelay = (i: number) => i * ANIM.stagger;
export const writeDelay = (i: number) => showDelay(i) + ANIM.showDuration;

export type ShowProps = {
  initial: { opacity: number; scale: number; y: number };
  animate: { opacity: number; scale: number; y: number };
  transition: Transition;
};

export const showProps = (i: number): ShowProps => ({
  initial: { opacity: 0, scale: 0.8, y: 50 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: { delay: showDelay(i), duration: ANIM.showDuration, ease: 'easeOut' },
});

const steps = (n: number) => (t: number) => (n <= 0 ? 1 : Math.floor(t * n) / n);

export type WriteOnProps = {
  initial: { clipPath: string };
  animate: { clipPath: string };
  transition: Transition;
};

export const writeOnProps = (delay: number, chars: number): WriteOnProps => ({
  initial: { clipPath: 'inset(0 100% 0 0)' },
  animate: { clipPath: 'inset(0 0% 0 0)' },
  transition: { delay, duration: ANIM.writeDuration, ease: steps(chars) },
});

export const textLength = (node: ReactNode): number =>
  Children.toArray(node).reduce<number>((n, child) => {
    if (typeof child === 'string' || typeof child === 'number') return n + String(child).length;
    if (isValidElement(child))
      return n + textLength((child.props as { children?: ReactNode }).children);
    return n;
  }, 0);

export type BoxAnimProps = {
  initial: false;
  animate: { opacity: number; x: number; visibility: 'visible' | 'hidden' };
  transition: Transition;
};

export type TabAnimProps = {
  initial: false;
  animate: { opacity: number; visibility: 'visible' | 'hidden' };
  transition: Transition;
};

export const boxBodyProps = (shown: boolean): BoxAnimProps => ({
  initial: false,
  animate: shown
    ? { opacity: 1, x: 0, visibility: 'visible' }
    : { opacity: 0, x: 80, visibility: 'hidden' },
  transition: shown ? { duration: 0.2, ease: 'easeOut' } : { duration: 0.12, ease: 'easeIn' },
});

export const boxTabProps = (shown: boolean): TabAnimProps => ({
  initial: false,
  animate: shown ? { opacity: 1, visibility: 'visible' } : { opacity: 0, visibility: 'hidden' },
  transition: shown ? { duration: 0.2, ease: 'easeOut' } : { duration: 0.1, ease: 'easeIn' },
});
