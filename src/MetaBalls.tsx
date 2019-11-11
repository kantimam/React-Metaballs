import React, { useRef, useLayoutEffect } from 'react';
import { Metaball } from './metaball';
import PropTypes from 'prop-types';

type propTypes = {
  orbData?: Array<{
    size?: number;

    posX?: number;
    posY?: number;

    colorR?: number;
    colorG?: number;
    colorB?: number;

    moveX?: number;
    moveY?: number;
  }>,
  innerContainer?: React.ReactNode
  children?: any
}

const MetaBalls: React.FC<propTypes> = ({ orbData = [{}, {}], innerContainer, children }) => {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const metaball = new Metaball(containerRef.current, orbData)
    metaball.create();
    metaball.render();
    return () => {
      metaball.destroy();
    };
  }, [])

  return (
    <div id="metaballContainer" style={{ width: "100%", height: "100%"}}>
      <canvas ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}/>
      {innerContainer /* can be used to further contain the orbs while having some of the glow spread over the entire page*/}
      <section style={{ width: "100%", height: "100%", position: "absolute", left: 0, top: 0 }}>
        {children /*YOUR FULL PAGE CONTENT GOES HERE*/}
      </section>
    </div>

  );
}



export default MetaBalls;
