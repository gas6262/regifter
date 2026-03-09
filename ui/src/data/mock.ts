export type Recipient = {
  name: string;
  email: string;
  message: string;
};

export type CardInput = {
  brand: string;
  openedBalance: number;
  spendFloor: number;
};

export const defaultCard: CardInput = {
  brand: 'Amazon',
  openedBalance: 36.72,
  spendFloor: 2,
};

export const defaultRecipient: Recipient = {
  name: 'Maya Chen',
  email: 'maya@example.com',
  message: 'Tiny surprise. Coffee is on me.',
};
