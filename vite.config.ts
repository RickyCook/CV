import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const getContacts = () => {
  try {
    return require('./contacts');
  } catch (err) {
    // biome-ignore lint/suspicious/noConsole: true error message
    console.error(`No contacts due to ${err}`);
  }
  return null;
};

export default defineConfig({
  define: {
    CONTACTS: JSON.stringify(getContacts()),
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
});
