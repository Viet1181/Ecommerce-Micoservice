import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
