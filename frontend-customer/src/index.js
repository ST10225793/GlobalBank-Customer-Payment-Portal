import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// GLOBAL COMPILATION SAFEGUARD: 
// Now that imports are at the top, this block satisfies ESLint rules.
if (typeof window !== 'undefined') {
  window.db = window.db || {};
  if (!window.db._checkNotDeleted) {
    window.db._checkNotDeleted = function() { return false; };
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


reportWebVitals();
