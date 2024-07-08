import React from 'react';
import './Main.scss';
import Gun from './common/gun.tsx';

function App() {
  return (
    <div className="Main-wrapper">
      <p className="guns">
        <Gun index={0} />
        <Gun index={1} />
        <Gun index={2} />
      </p>
    </div>
  );
}

export default App;
