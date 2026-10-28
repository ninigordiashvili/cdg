// Palette taken from the logo and the Facebook page (cream cover, sage line-art birds, charcoal type).
export const colors = {
  brand: 'var(--c-brand)', // logo green
  brandDark: 'var(--c-brand-dark)', // AA contrast with white text
  brandDeep: 'var(--c-brand-deep)',
  sage: 'var(--c-sage)', // cover birds
  sageSoft: 'var(--c-sage-soft)',
  cream: 'var(--c-cream)', // cover background
  creamSoft: 'var(--c-cream-soft)',
  ink: 'var(--c-ink)', // charcoal headings
  muted: 'var(--c-muted)',
  line: 'var(--c-line)',
  bg: 'var(--c-bg)',
  white: 'var(--c-white)',
};

export const breakpoints = {
  mobile: '768px',
  tablet: '1080px',
};

export const mq = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
};
