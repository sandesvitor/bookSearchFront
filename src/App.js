import React from 'react';
import logo from './book.svg';
import './App.css';

import Busca from './components/Busca'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>Search books from your favorite author!</h2>
        <h3 id="version">v 0.1</h3>
        <img src={logo} className="App-logo" alt="logo" />
        <Busca></Busca>                 
      </header>
    </div>
  );
}

export default App;
