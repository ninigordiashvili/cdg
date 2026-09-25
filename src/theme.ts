// Palette taken from the logo and the Facebook page (cream cover, sage line-art birds, charcoal type).
export const colors = {
  brand: '#08B250', // logo green
  brandDark: '#067A38', // AA contrast with white text
  brandDeep: '#0E3B24',
  sage: '#B9D6A5', // cover birds
  sageSoft: '#DCE9CF',
  cream: '#F2ECD9', // cover background
  creamSoft: '#F8F5EA',
  ink: '#2F3432', // charcoal headings
  muted: '#5C625E',
  line: '#E3DDC8',
  bg: '#FDFCF7',
  white: '#FFFFFF',
};

export const breakpoints = {
  mobile: '768px',
  tablet: '1080px',
};

export const mq = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
};
