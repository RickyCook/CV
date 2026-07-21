import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const getContacts = () => {
    try {
        return require('./contacts');
    } catch(err) {
        console.error(`No contacts due to ${err}`);
    }
    return null;
}

export default defineConfig({
    define: {
        CONTACTS: JSON.stringify(getContacts()),
    },
  plugins: [
    react({
      plugins: [
        ['@swc/plugin-styled-components', {
          displayName: true,
          ssr: true,
        }],
      ],
    }),
  ],
});