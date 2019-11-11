import frag from './shaders/frag';
import vert from './shaders/vert';
import Orb from './Orb';
import {checkCollisionRect, createShaderProgram, randomInRange} from './util';


interface OrbConfig {
    size?: number;
    
    posX?: number;
    posY?: number;

    colorR?: number;
    colorG?: number;
    colorB?: number;

    moveX?: number;
    moveY?: number;
}

export class Metaball {
    canvasRef: HTMLCanvasElement;
    orbSettings: Array<OrbConfig>;
    orbArray: Array<Orb>;
    containerObject: object;
    gl: WebGLRenderingContext;
    shaderProgram: WebGLProgram;
    renderLoop: number;

    lastContainerWidth: number;
    lastContainerHeight: number

    constructor(canvasRef: HTMLCanvasElement, orbSettings: Array<object>, containerObject?: object) {
        this.canvasRef = canvasRef;
        this.orbSettings = orbSettings;
        this.containerObject = containerObject ? containerObject : null;
        this.gl = canvasRef.getContext("webgl")
        this.shaderProgram = null;

        this.lastContainerWidth=canvasRef.clientWidth;
        this.lastContainerHeight=canvasRef.clientHeight;
    }
    setCanvasDim() {
        this.canvasRef.width = this.canvasRef.clientWidth;
        this.canvasRef.height = this.canvasRef.clientHeight;
    }

    create() {
        /* set renderer dimensions */
        this.setCanvasDim();

        this.createOrbs();

        /* change fragment shaderstring with calculated arraysize */
        const fragWithDynamicLength = this.setDynamicLength(frag, this.orbSettings.length);
        this.shaderProgram = createShaderProgram(this.gl, vert, fragWithDynamicLength);
    }

    private createOrbs() {
        const {width, height}=this.canvasRef;
        this.orbArray=[]

        /* if some orbSettings are given use them to create the orbs */
        if(this.orbSettings && this.orbSettings.length>0){
            return this.orbSettings.forEach((orbConfig, index)=>{
                this.orbArray[index]=new Orb(
                    orbConfig.size || randomInRange(40, 150),
                    orbConfig.posX ||  randomInRange(0, width), 
                    orbConfig.posY || randomInRange(0, height),
                    orbConfig.colorR || randomInRange(0, 255), 
                    orbConfig.colorG || randomInRange(0, 255), 
                    orbConfig.colorB || randomInRange(0, 255),
                    orbConfig.moveX || randomInRange(1, 5), 
                    orbConfig.moveY || randomInRange(1, 5) 
                )
            })
        }
        /* else go full random */
        for (let i = 0; i < this.orbSettings.length; i++) {
            this.orbArray[i]=new Orb(
                randomInRange(40, 150),
                randomInRange(0, width), randomInRange(0, height),
                randomInRange(0, 255), randomInRange(0, 255), randomInRange(0, 255),
                randomInRange(1, 5), randomInRange(1, 5) 
            )
        }
    }

    private setDynamicLength = (shaderString: string, length: number): string => {
        const dataLengthSet = shaderString.replace(/<DYNAMIC_LENGTH>/, String(length * 6));
        const arrSizeSet = dataLengthSet.replace(/<ORBCOUNT=0>/, `ORBCOUNT=${length}`);
        return arrSizeSet;
    }

    private setPositionInBounds=()=>{
        this.orbArray.forEach(e=>{
            /* get the relative position with the previos containersize and set it for the new containersize */
            e.positionX=Math.floor(e.positionX/this.lastContainerWidth * this.canvasRef.clientWidth)
            e.positionY=Math.floor(e.positionY/this.lastContainerHeight * this.canvasRef.clientHeight)
        })

        /* update lastContainer size */
        this.lastContainerWidth=this.canvasRef.clientWidth;
        this.lastContainerHeight=this.canvasRef.clientHeight;
    }

    private u_orbDataFromArray=(orbArray)=>{
        const u_orbDataArray=[];
        for(let i=0; i<orbArray.length; i++){
            u_orbDataArray.push(orbArray[i].size);
            u_orbDataArray.push(orbArray[i].positionX);
            u_orbDataArray.push(orbArray[i].positionY);
            u_orbDataArray.push(orbArray[i].colorR/255); // scale colors to 0-1.0 for the shader to reduce math in loops there
            u_orbDataArray.push(orbArray[i].colorG/255);
            u_orbDataArray.push(orbArray[i].colorB/255);
        }
        return u_orbDataArray;
    }

    private updateOrbs=()=>{
        for(let i=0; i<this.orbArray.length; i++){
            this.orbArray[i].updatePosition();
            checkCollisionRect(this.orbArray[i], 0, this.canvasRef.width, this.canvasRef.height, 0);
        }
    }



    render() {
        let positionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position");

        // Create a buffer to put three 2d clip space points in 
        let positionBuffer = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, // tri 1
            1, -1,
            -1, 1,
            -1, 1, // tri 2
            1, -1,
            1, 1,
        ]), this.gl.STATIC_DRAW);

        // Tell it to use our program (pair of shaders)
        this.gl.useProgram(this.shaderProgram);


        // look up resolution uniform location
        const uResolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");

        // look up orb uniform array location
        const uOrbArrayLocation = this.gl.getUniformLocation(this.shaderProgram, "u_orbData");

        const uDistModifierLocation = this.gl.getUniformLocation(this.shaderProgram, "u_distanceModifier");

        this.gl.uniform1f(uDistModifierLocation, 5.0);
        // set resolution
        this.gl.uniform2fv(uResolutionLocation, [this.canvasRef.clientWidth, this.canvasRef.clientHeight]);



        // Turn on the position attribute
        this.gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);


        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2; // 2 components per iteration
        let type = this.gl.FLOAT; // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0; // start at the beginning of the buffer
        this.gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);


        this.gl.viewport(0, 0, this.canvasRef.width, this.canvasRef.height);
        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        window.onresize = () => {
            this.setCanvasDim()

            /* recover orbs that might be off screen */
            this.setPositionInBounds()

            this.gl.uniform2fv(uResolutionLocation, [this.canvasRef.clientWidth, this.canvasRef.clientHeight]);
            this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        }


        const drawLoop = () => {
            this.updateOrbs();
            this.gl.uniform1fv(uOrbArrayLocation,
                this.u_orbDataFromArray(this.orbArray)
            )

            // Draw the rectangle.
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);



            this.renderLoop = requestAnimationFrame(drawLoop);
        }
        drawLoop();
    }



    destroy() {
        cancelAnimationFrame(this.renderLoop);
        this.gl.deleteProgram(this.shaderProgram);
    }

}



