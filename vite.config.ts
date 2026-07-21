import path from 'node:path';
import { pathToFileURL } from 'node:url';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

import type { ContactsMap } from './src/contacts';

const getContacts = async (): Promise<ContactsMap | null> => {
  try {
    // contacts.ts is local-only (gitignored). Resolve at runtime so that the config
    // bundle doesn't include it, and builds without the file (eg deploys) still work.
    // Node strips its types when importing the .ts file at runtime.
    const spec = pathToFileURL(path.resolve('contacts.ts')).href;
    const mod: { default: ContactsMap } = await import(spec);
    return mod.default;
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: true error message
    console.error(`No contacts due to ${err}`);
  }
  return null;
};

export default defineConfig(async () => ({
  build: {
    outDir: 'build',
  },
  define: {
    CONTACTS: JSON.stringify(await getContacts()),
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react({
      plugins: [
        [
          '@swc/plugin-styled-components',
          {
            displayName: true,
            ssr: true,
          },
        ],
      ],
    }),
  ],
}));
