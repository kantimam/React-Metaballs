import { tsConstructorType } from "@babel/types";

export class Metaball{
    canvasRef:HTMLCanvasElement;
    orbSettings:Array<object>;
    containerObject:object | null;
    gl:WebGLRenderingContext | null;
    shaderProgram:WebGLProgram | null;
    
    constructor(canvasRef:HTMLCanvasElement, orbSettings:Array<object>, containerObject?:object){
        this.canvasRef=canvasRef;
        this.orbSettings=orbSettings;
        this.containerObject=containerObject? containerObject : null;
        this.gl=canvasRef.getContext("webgl")
        this.shaderProgram=null;
    }
    

    create(){
        this.shaderProgram=createShaderProgram(this.gl, "", "")
    }

    
}


const createShaderProgram = (gl:any, vertexShaderSource:string, fragmentShaderSource:string) => {

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    const program = createProgram(gl, vertexShader, fragmentShader);

    return program
}


const createShader = (gl:any, type:number, source:any) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const succes = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (succes) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

const createProgram = (gl:any, vertexShader:any, fragmentShader:any) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}