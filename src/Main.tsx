import React from 'react';
import './Main.scss';
import Gun from './common/gun.tsx';

function App() {
  return (
    <div className="Main-wrapper">
      <header className="App-header">
        <Gun index={0} />
      </header>
    </div>
  );
}

export default App;
