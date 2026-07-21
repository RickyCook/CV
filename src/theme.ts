const spacer = 10;

const base = {
  bodyWidth: 1000,
  text: '#C5C8C6',
  primary: '#ED8028',
  primaryBright: '#FD9038',
  primaryDark: '#CD6008',
  primaryHighlight: 'white',
  secondary: '#003049',
  secondaryBright: '#104059',
  secondaryDark: '#002039',
  background: '#212128',
  spacer,
  chevronWidth: 15,
  boxHeaderHeight: 50,
  shadowDistance: 4,
  thickBorderWidth: 3,

  competence: {
    great: '#00FF00',
    good: '#00AAAA',
    competent: '#4477AA',
  },
};

export const theme = {
  ...base,
  bodyMargin: spacer * 1.5,
  link: base.primary,
  linkAlt: base.primaryDark,
  primaryText: base.background,
  primaryBg: base.primary,
  primaryBrightBg: base.primaryBright,
  primaryLeftStripeBg: base.primaryDark,
  secondaryText: base.text,
  secondaryBg: base.secondary,
  secondaryBrightBg: base.secondaryBright,
  secondaryLeftStripeBg: base.secondaryDark,
  plainText: base.text,
  plainBg: 'rgba(0,0,0,0)',
  plainLeftStripeBg: 'rgba(0,0,0,0)',
  boxClickableText: base.text,
  boxClickableBg: base.secondary,
  boxClickableBrightBg: base.secondaryBright,
};

export type Theme = typeof theme;
export type ThemeVariant = 'primary' | 'secondary' | 'plain';
export type CompetenceLevel = keyof typeof theme.competence;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
