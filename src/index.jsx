import React from 'react';
import ReactDOM from 'react-dom';

import { createGlobalStyle, ThemeProvider } from 'styled-components/macro';

import { App } from './components/App'
import { theme } from './theme'


const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }
`
const AppWrapper = props => (
  <ThemeProvider theme={ theme }>
    <GlobalStyle />
    <App />
  </ThemeProvider>
)


const render = () => {
  const rootElement = document.getElementById("root");
  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrate(<AppWrapper />, rootElement);
  } else {
    ReactDOM.render(<AppWrapper />, rootElement);
  }
};

render()
