import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

ReactDOM.render(
  <ErrorBoundary>
    <App />,
  </ErrorBoundary>,
  // <React.StrictMode>
  // </React.StrictMode>,
  document.getElementById('root'),
);
