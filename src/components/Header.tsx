import { m } from 'motion/react';
import type { ReactNode } from 'react';
import { tv } from 'tailwind-variants';

import 'typeface-share-tech-mono/index.css';

import { textLength, type Variant, writeOnProps } from '../lib/anim';

const grid = 'font-display grid w-fit grid-cols-[25px_max-content] items-stretch';

const headerTv = tv({
  base: `${grid} border-l-[10px] my-[15px] print:m-0 print:border-none`,
  variants: {
    type: {
      primary: 'border-primary-dark',
      secondary: 'border-secondary-dark',
      plain: 'border-white/10',
    },
  },
  defaultVariants: { type: 'primary' },
});

const bodyHeaderTv = tv({
  extend: headerTv,
  base: '-mt-[15px] -ml-[15px] print:m-0',
});

const fillTv = tv({
  variants: {
    type: {
      primary: 'bg-primary text-background',
      secondary: 'bg-secondary text-text',
      plain: 'bg-transparent text-text',
    },
  },
  defaultVariants: { type: 'primary' },
});

const subHeaderTv = tv({
  base: `${grid} border-l-[10px] -mt-[30px] mb-[15px] print:m-0 print:border-none`,
  variants: {
    type: {
      primary: 'border-primary-dark',
      secondary: 'border-secondary-dark',
      plain: 'border-transparent',
    },
  },
  defaultVariants: { type: 'primary' },
});

const Chevron = () => (
  <span aria-hidden className="text-white print:text-primary">
    &gt;
  </span>
);
const Trail = () => (
  <span aria-hidden className="text-white print:text-primary">
    _
  </span>
);

interface HeaderProps {
  children?: ReactNode;
  type?: Variant;
  trail?: boolean;
  writeDelay?: number;
}

type HeaderTag = 'h1' | 'h2' | 'h3' | 'h4';
type TvFn = (opts: { type?: Variant }) => string;

const asFn = (tv: unknown): TvFn => tv as unknown as TvFn;

const makeHeader =
  (Tag: HeaderTag, tvFn: TvFn = asFn(headerTv)) =>
  ({ children, type, trail, writeDelay }: HeaderProps) => {
    const wrapper = tvFn({ type });
    const fill = fillTv({ type });
    const inner: ReactNode = (
      <>
        <div aria-hidden className={`${fill} flex items-center justify-center`}>
          <Chevron />
        </div>
        <Tag className={`${fill} font-bold py-[10px] pr-[25px] print:p-0`}>
          {children}
          {trail && <Trail />}
        </Tag>
      </>
    );
    if (writeDelay != null) {
      return (
        <m.div className={wrapper} {...writeOnProps(writeDelay, textLength(inner))}>
          {inner}
        </m.div>
      );
    }
    return <div className={wrapper}>{inner}</div>;
  };

export const Header1 = makeHeader('h1', asFn(headerTv));
export const BodyHeader = makeHeader('h1', asFn(bodyHeaderTv));
export const Header2 = makeHeader('h2', asFn(headerTv));
export const Header3 = makeHeader('h3', asFn(headerTv));
export const Header4 = makeHeader('h4', asFn(headerTv));

export const SubHeader = ({ children, type }: { children?: ReactNode; type?: Variant }) => {
  const fill = fillTv({ type });
  return (
    <div className={subHeaderTv({ type })}>
      <div aria-hidden className={`${fill} w-[25px] flex items-center justify-center`} />
      <div className={`${fill} py-[10px] pr-[25px] max-w-[60ch] print:p-0`}>{children}</div>
    </div>
  );
};
