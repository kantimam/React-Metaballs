import React, { useRef, useLayoutEffect, useState } from 'react';
import { Metaball } from './metaball';

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
  innerContainer?:  React.ReactElement
  children?: any
}

const MetaBalls: React.FC<propTypes> = ({ orbData = [{}, {}], innerContainer, children }) => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  let innerRef = useRef<HTMLElement>(null);

  const innerCont=React.cloneElement(innerContainer,{ref:innerRef}, null);

  useLayoutEffect(() => {
    let metaball: Metaball;
    if (innerContainer) {
      metaball = new Metaball(containerRef.current, orbData, innerRef.current)
    }
    else {
      metaball = new Metaball(containerRef.current, orbData)
    }
    metaball.create();
    metaball.render();
    return () => {
      metaball.destroy();
    };
  }, [])

  return (
    <div id="metaballContainer" style={{ width: "100%", height: "100%", position: "relative", overflow: "auto"}}>
      <canvas ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", left: 0, top: 0 }} />
      {innerCont}  {/* can be used to further contain the orbs while having some of the glow spread over the entire page*/}
      <section style={{ width: "100%", height: "100%", position: "absolute", left: 0, top: 0 }}>
        {children} { /*YOUR FULL PAGE CONTENT GOES HERE*/}
      </section>
    </div>

  );
}



export default MetaBalls;
