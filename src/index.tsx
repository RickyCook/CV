import ReactDOM, { hydrateRoot } from 'react-dom/client';

import { App } from './components/App';

import './index.css';

import 'typeface-overpass-mono/index.css';

const AppWrapper = () => <App />;

const render = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('No root element found');
  }
  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, <AppWrapper />);
  } else {
    ReactDOM.createRoot(rootElement).render(<AppWrapper />);
  }
};

render();
