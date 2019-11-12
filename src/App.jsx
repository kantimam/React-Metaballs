import React from 'react';
import MetaBalls from 'react-webgl-metaballs'
import './App.css';



const App = () => {
  return (
    <div className="App">
      <MetaBalls innerContainer={<div id="inner"></div>}></MetaBalls>
    </div>
  );
}

export default App;
