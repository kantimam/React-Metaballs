import React, {useRef, useLayoutEffect} from 'react';
import {Metaball} from './metaball';
import './App.css';

const App: React.FC = () => {
  const containerRef=useRef<HTMLCanvasElement>(null);

  const orbData=[
    /* {posX: 17, posY:19, size: 99},
    {posX:188, posY:290, size: 180} */
    {},{},{},{},{},{},{},{}
  ]

  useLayoutEffect(() => {
    const metaball=new Metaball(containerRef.current, orbData)
    metaball.create();
    metaball.render();
    return () => {
      metaball.destroy();
    };
  }, [])

  return (
    <canvas ref={containerRef} className="App">

    </canvas>
  );
}

export default App;
