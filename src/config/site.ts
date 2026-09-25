// Central place for external links and contact details.
// Leave a value empty ('') to hide the related button / row on the site.
export const site = {
  // Google Form: "დახმარების გაცემის განცხადება / მომართვის ფორმა არასრულწლოვანისთვის"
  beneficiaryFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScFreQXKIO3xEienLcgsAjsXgq12iuSrwuNbMFfhtwjXdKTCw/viewform',
  beneficiaryFormEmbedUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScFreQXKIO3xEienLcgsAjsXgq12iuSrwuNbMFfhtwjXdKTCw/viewform?embedded=true',

  // Online payment page (e.g. TBC / BOG e-commerce link). Card + Apple Pay are handled by the bank page.
  donationPaymentUrl: '',

  // Bank transfer details
  bankAccounts: [] as { bank: string; iban: string }[],
  bankRecipient: '',

  facebookUrl: '',
  instagramUrl: '',
  email: '',
  phone: '',
};
