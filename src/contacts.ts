export interface ContactDetails {
  phone?: string;
  email?: string;
}

export type ContactsMap = Record<string, ContactDetails>;

declare global {
  const CONTACTS: ContactsMap | null;
}

export const contacts: ContactsMap | null = CONTACTS;
