import ReactDOM, { hydrateRoot } from 'react-dom/client';

import { Root } from './components/Root';

import './index.css';

import 'typeface-overpass-mono/index.css';

const features = () => import('motion/react').then((mod) => mod.domAnimation);

const render = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('No root element found');
  }
  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, <Root features={features} />);
  } else {
    ReactDOM.createRoot(rootElement).render(<Root features={features} />);
  }
};

render();
