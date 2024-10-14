import * as pc from "playcanvas"
import { Cell } from './cell';


export class Teleport{
    private startTeleport: pc.Entity;
    private endTeleport: pc.Entity;
    private startCell: Cell;
    private endCell: Cell;
    private app: pc.Application;
  
    constructor(start: Cell, end: Cell, app: pc.Application) {
        this.startCell = start; 
        this.endCell = end;
        this.app = app;

        //Start
        var startMaterial = new pc.StandardMaterial();

        startMaterial.diffuse.set(102 / 255, 255 / 255, 102 / 255);

        startMaterial.update();

        this.startTeleport = new pc.Entity();
        this.startTeleport.addComponent("model", {
            type: "box"
        });

        if (this.startTeleport.model && this.startTeleport.model.meshInstances.length > 0) {
        this.startTeleport.model.meshInstances[0].material = startMaterial;
        } else {
            console.error("Model or meshInstances not initialized properly.");
        }

        this.startTeleport.setLocalScale(0.5, 0.1, 0.5);
        this.startTeleport.setLocalPosition(this.startCell.i, 0, this.startCell.j);


        app.root.addChild(this.startTeleport);

        //End
        var endMaterial = new pc.StandardMaterial();

        endMaterial.diffuse.set(102 / 255, 102 / 255, 255 / 255);

        endMaterial.update();

        this.endTeleport = new pc.Entity();
        this.endTeleport.addComponent("model", {
            type: "box"
        });

        if (this.endTeleport.model && this.endTeleport.model.meshInstances.length > 0) {
        this.endTeleport.model.meshInstances[0].material = endMaterial;
        } else {
            console.error("Model or meshInstances not initialized properly.");
        }

        this.endTeleport.setLocalScale(0.5, 0.1, 0.5);
        this.endTeleport.setLocalPosition(this.endCell.i, 0, this.endCell.j);


        app.root.addChild(this.endTeleport);
    }
}