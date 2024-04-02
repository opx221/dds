export const COMMANDS = [
  {
    command: '/start',
    description: 'Info',
  },
  {
    command: '/wallet',
    description: 'Your wallet',
  },
  {
    command: '/list',
    description: 'Listings',
  },
];
export const SHORT_DESC = (
  'Our verifable contacts are available on example.com'
);
export const DEFAULT_MARKUP = {
  reply_markup: {
    keyboard: [
      [
        '/start',
      ],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};
