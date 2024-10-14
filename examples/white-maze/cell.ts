import * as pc from "playcanvas";

export class Cell {
  private cell: pc.Entity;
  public walls = [true, true, true, true];
  public visited = false; 
  public i: number;
  public j: number;
  private app: pc.Application;
  
  constructor(i: number, j: number, app: pc.Application) {
    this.i = i; 
    this.j = j;
    this.app = app;
    
    var material = new pc.StandardMaterial();

    material.diffuse.set(204 / 255, 204 / 255, 204 / 255);

    material.update();

    this.cell = new pc.Entity();
    this.cell.addComponent("model", {
        type: "plane"
    });

    if (this.cell.model && this.cell.model.meshInstances.length > 0) {
      this.cell.model.meshInstances[0].material = material;
  } else {
      console.error("Model or meshInstances not initialized properly.");
  }

    this.cell.setLocalScale(1, 1, 1);
    this.cell.setLocalPosition(this.i, 0, this.j);


    app.root.addChild(this.cell);
  }

  private createWall(x: number, y: number, z: number, rotation: number = 0): void {
    const box = new pc.Entity();
    box.addComponent("model", {
      type: "box"
    });
    box.setLocalPosition(x, y, z);
    box.setLocalScale(0.05, 1, 1);
    
    if (rotation) {
        box.rotate(0, rotation, 0);
    }

    this.cell.addChild(box);
  }

  public showWall(): void{
    if(this.walls[0])
        this.createWall(0, 0.5, -0.5, 90)
    if(this.walls[1])
        this.createWall(0, 0.5, 0.5, 90)
    if(this.walls[2])
        this.createWall(0.5,0.5,0)
    if(this.walls[3])
        this.createWall(-0.5, 0.5, 0)
  }

  // Helper function to handle grid indexing and bounds check
  private index(i: number, j: number, cols: number, rows: number): number | undefined {
    if (i < 0 || j < 0 || i >= cols || j >= rows) {
      return undefined; // If out of bounds, return undefined
    }
    return i + j * cols; // Return the 1D index for the 2D array
  }

  // The checkNeighbors function
  public checkNeighbors(grid: Cell[], cols: number, rows: number): Cell | undefined {
    let neighbors:Cell[] = [];
  
    // Get neighbors using the index helper function and check if the result is defined
    const topIndex = this.index(this.i, this.j - 1, cols, rows);
    const bottomIndex = this.index(this.i, this.j + 1, cols, rows);
    const rightIndex = this.index(this.i + 1, this.j, cols, rows);
    const leftIndex = this.index(this.i - 1, this.j, cols, rows);
  
    const top = topIndex !== undefined ? grid[topIndex] : undefined;
    const bottom = bottomIndex !== undefined ? grid[bottomIndex] : undefined;
    const right = rightIndex !== undefined ? grid[rightIndex] : undefined;
    const left = leftIndex !== undefined ? grid[leftIndex] : undefined;
  
    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }
  
    if (neighbors.length > 0) {
      let r = Math.floor(Math.random() * neighbors.length); // Pick a random neighbor
      return neighbors[r];
    } else {
      return undefined; // Return undefined if no unvisited neighbors are available
    }
  }
  
}
