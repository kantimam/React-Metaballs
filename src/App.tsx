import React, {useRef, useLayoutEffect} from 'react';
import {Metaball} from './metaball';
import './App.css';

const App: React.FC = () => {
  const containerRef=useRef<HTMLCanvasElement>(document.createElement("canvas"));

  const orbData=[
    {x: 17, y:19},
    {x:188, y:290}
  ]

  useLayoutEffect(() => {
    Metaball(containerRef.current, orbData)
    return () => {
      
    };
  }, [])

  return (
    <canvas ref={containerRef} className="App">

    </canvas>
  );
}

export default App;
