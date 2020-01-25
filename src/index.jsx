import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components/macro';

import { App } from './components/App'
import { theme } from './theme'

import 'typeface-overpass-mono';


const GlobalStyle = createGlobalStyle`
  body {
    position: relative;
    max-width: ${props => props.theme.bodyWidth}px;
    font-family: 'Overpass Mono';
    font-weight: lighter;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    margin: ${props => props.theme.bodyMarginPx};
    line-height: 1.75em;

    @media (min-width: ${props => props.theme.bodyWidth + props.theme.bodyMargin}px) {
      margin-left: auto;
      margin-right: auto;
    }
    @media print {
      font-size: 0.75em;
    }
  }
  a {
    color: ${props => props.theme.link};
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
