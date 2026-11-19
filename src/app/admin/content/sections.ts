// Friendly names for the top-level groups of src/dictionary/*.json.
// Groups not listed here (e.g. the accessibility panel) are not editable.
export const SECTION_TITLES: Record<string, { title: string; hint: string }> = {
  meta: { title: 'Site title & description', hint: 'Shown in browser tabs and search results.' },
  nav: { title: 'Menu', hint: 'Navigation links and buttons in the header.' },
  home: { title: 'Home page', hint: 'Welcome text, statistics and highlights.' },
  cdg: { title: 'What is CDG?', hint: 'Information page about CDG.' },
  autism: { title: 'What is autism?', hint: 'Information page about autism.' },
  rare: { title: 'Rare diseases', hint: 'Introduction and list of diseases.' },
  events: { title: 'Events page', hint: 'Awareness days and page headings.' },
  about: { title: 'About us', hint: 'Mission, values and story.' },
  beneficiary: { title: 'Become a beneficiary', hint: 'Application page.' },
  donate: { title: 'Donate', hint: 'Ways to support the foundation.' },
  contact: { title: 'Contact', hint: 'Contact page texts.' },
  common: { title: 'Shared texts', hint: 'Buttons and notes used on many pages.' },
  footer: { title: 'Footer', hint: 'Motto and text at the bottom of every page.' },
};
