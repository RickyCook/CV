import { domAnimation } from 'motion/react';
import { renderToString } from 'react-dom/server';

import { Root } from './components/Root';

export const render = (): string => renderToString(<Root features={domAnimation} />);
