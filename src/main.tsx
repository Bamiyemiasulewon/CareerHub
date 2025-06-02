// Import React and ReactDOM for rendering
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the main App component and styles
import App from './App';
import './index.css';

// Create a root element and render the app
// The '!' operator asserts that the element exists
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode helps identify potential problems in the application
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
