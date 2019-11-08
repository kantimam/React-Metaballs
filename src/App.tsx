import React, {useRef} from 'react';
import './App.css';

const App: React.FC = () => {
  const containerRef=useRef<HTMLCanvasElement>(null);

  return (
    <canvas ref={containerRef} className="App">

    </canvas>
  );
}

export default App;
