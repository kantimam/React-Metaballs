export default class Orb{
    size: number;
    positionX: number;
    positionY: number;
    colorR: number;
    colorG: number;
    colorB: number;
    moveX: number;
    moveY: number;
    constructor(size: number, positionX: number, positionY: number, colorR: number, colorG: number, colorB: number, moveX: number, moveY: number){
        this.size=size;
        this.positionX=positionX;
        this.positionY=positionY;
        this.moveX=moveX;
        this.moveY=moveY;
        this.colorR=colorR;
        this.colorG=colorG;
        this.colorB=colorB;
    }
    updatePosition(){
        this.positionX+=this.moveX;
        this.positionY+=this.moveY;
    }
}