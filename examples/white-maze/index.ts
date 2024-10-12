import * as pc from "playcanvas";
import { Cell } from './cell';

window.onload = () => {

  let row = 10;
  let col = 10;
  let grid: Cell[] = [];
  let stack: Cell[] = []; 
  let current: Cell; 
  // ==============================CREATE APPLICATION==============================
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;
  document.body.appendChild(canvas);

  const app = new pc.Application(canvas);
  app.start();

  // ==================================ADD CAMERA=================================
  const cameraEntity = new pc.Entity("MainCamera");
  app.root.addChild(cameraEntity);
  cameraEntity.addComponent("camera", {
    clearColor: new pc.Color(66 / 255, 135 / 255, 245 / 255)
  });
  cameraEntity.setPosition(row/2, row+5, col/2);
  cameraEntity.rotate(-90, 0, 0);

  
  // ==================================ADD LIGHT==================================
  const light = new pc.Entity("DirectionalLight");
  app.root.addChild(light);
  light.addComponent("light", {
    type: pc.LIGHTTYPE_DIRECTIONAL,
    color: new pc.Color(1, 1, 1),
    intensity: 1
  });
  light.setEulerAngles(45, 0, 0);
  
  // =============================FULL SCREEN CANVAS==============================
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);
  window.addEventListener("resize", () => app.resizeCanvas());
  
  
  
  // ==================================CREATE AND ADD CELLS========================
  for (let j = 0; j < row; j++) {
    for (let i = 0; i < col; i++) {
      var cell = new Cell(i, j, app);
      grid.push(cell);
    }
  }

  app.on("update", (dt) => {
    for(let i = 0; i < grid.length; i++){
      grid[i].showWall();
    }
  });
};
