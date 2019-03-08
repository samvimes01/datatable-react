import React from 'react';
import { render } from 'react-dom';

import './styles/index.css';
import App from './App';

function renderApp() {
  render(<App />, document.getElementById('root'));
}

renderApp();

if (module.hot) {
  module.hot.accept(renderApp);
}
