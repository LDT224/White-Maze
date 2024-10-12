import * as pc from "playcanvas";

export class Cell {
  private cell: pc.Entity;
  private walls = [true, true, true, true];
  private visited = false;

  constructor(i: number, j: number, app: pc.Application) {
    this.cell = new pc.Entity();

    this.cell.addComponent("model", {
      type: "plane"
    });
    this.cell.setLocalScale(1, 1, 1);
    this.cell.setLocalPosition(i, 0, j);

    // this.createWall(0.5, 0.5, 0);
    // this.createWall(-0.5, 0.5, 0);
    // this.createWall(0, 0.5, 0.5, 90);
    // this.createWall(0, 0.5, -0.5, 90);

    app.root.addChild(this.cell);
  }

  private createWall(x: number, y: number, z: number, rotation: number = 0): void {
    const box = new pc.Entity();
    box.addComponent("model", {
      type: "box"
    });
    box.setLocalPosition(x, y, z);
    box.setLocalScale(0.01, 1, 1);
    
    if (rotation) {
        box.rotate(0, rotation, 0);
    }

    this.cell.addChild(box);
  }

  public showWall(): void{
    if(this.walls[0])
        this.createWall(0.5,0.5,0)
    if(this.walls[1])
        this.createWall(-0.5, 0.5, 0)
    if(this.walls[2])
        this.createWall(0, 0.5, 0.5, 90)
    if(this.walls[3])
        this.createWall(0, 0.5, -0.5, 90)
  }
}
