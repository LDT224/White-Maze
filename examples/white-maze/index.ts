import * as pc from "playcanvas";
import { Cell } from './cell';
import { Teleport } from "./teleport";
import { Character } from "./character";
import { UIMenu } from './UIMenu';

window.onload = () => {
    let row = 10;
    let col = 10;
    let grid: Cell[] = [];
    let stack: Cell[] = []; 
    let current: Cell; 
    let mainCameraEntity: pc.Entity;
    let thirdPersonCameraEntity: pc.Entity;
    // ==============================CREATE APPLICATION==============================
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 300;
    document.body.appendChild(canvas);
    
    const app = new pc.Application(canvas);
    app.start();
    
    const uiMenu = new UIMenu(app);

    // ==================================ADD MAIN CAMERA=================================
    mainCameraEntity = new pc.Entity("MainCamera");
    app.root.addChild(mainCameraEntity);
    mainCameraEntity.addComponent("camera", {
        clearColor: new pc.Color(66 / 255, 135 / 255, 245 / 255)
    });
    mainCameraEntity.setPosition(row / 2, row + 5, col / 2);
    mainCameraEntity.rotate(-90, 0, 0);

    // ==================================ADD THIRD-PERSON CAMERA==========================
    thirdPersonCameraEntity = new pc.Entity("ThirdPersonCamera");
    app.root.addChild(thirdPersonCameraEntity);
    thirdPersonCameraEntity.addComponent("camera", {
        clearColor: new pc.Color(66 / 255, 135 / 255, 245 / 255)
    });
    
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
    
    // Set the gravity for our rigid bodies
    app.systems.rigidbody?.gravity.set(0,-9.81,0);
    
    // ==================================CREATE AND ADD CELLS========================
    for (let j = 0; j < row; j++) {
        for (let i = 0; i < col; i++) {
            var cell = new Cell(i, j, app);
            grid.push(cell);
        }
    }
    var teleport = new Teleport(grid[0], grid[grid.length - 1], app);

    current = grid[0];
    current.visited = true;

    //Gen Map
    function genMap() {
        for (let i = 0; i < grid.length; i++) {
            let next = current.checkNeighbors(grid, col, row);
            if (next) {
                next.visited = true; 
                stack.push(current);
                removeWalls(current, next);
                current = next;
            } else if (stack.length > 0) {
                current = stack.pop()!;
                i--;      
            } else if (!next && stack.length == 0) {
                for (let i = 0; i < grid.length; i++) {
                    grid[i].showWall();
                }
            }
        }
    }
    
    function removeWalls(a: Cell, b: Cell): void {
        let x = a.i - b.i;
        if (x === 1) {
            a.walls[3] = false; 
            b.walls[2] = false; 
        } else if (x === -1) {
            a.walls[2] = false; 
            b.walls[3] = false; 
        }
        let y = a.j - b.j;
        if (y === 1) {
            a.walls[0] = false; 
            b.walls[1] = false; 
        } else if (y === -1) {
            a.walls[1] = false; 
            b.walls[0] = false; 
        }
    }

    // ===============================CREATE AND ADD CHARACTER========================
    const assets = {
        charModelAsset: new pc.Asset("model_purus_girl", "model", { url: "../../assets/models/model_purus_girl.glb" }),
        charTextureAsset: new pc.Asset("tex_purus_girl", "texture", { url: "../../assets/textures/tex_purus_girl.jpg" }),
        charIdleAnimationAsset: new pc.Asset("anim_purus_girl_idle", "animation", { url: "../../assets/animations/anim_purus_girl_idle.glb" }),
        charRunAnimationAsset: new pc.Asset("anim_purus_girl_run", "animation", { url: "../../assets/animations/anim_purus_girl_run.glb" }),
    };

    const assetListLoader = new pc.AssetListLoader(Object.values(assets), app.assets);
    assetListLoader.load(() => {
        const character = new Character(app, assets);

        const charMovement = new pc.Vec3();
        const charSpeed = 3;
        const keyboard = new pc.Keyboard(document.body);
        genMap();
        
        app.on("update", (dt) => {

            if (!uiMenu.gameStarted) {
                return; 
            }

            if (!mainCameraEntity.enabled) {
                character.updateMovement(charMovement, keyboard, charSpeed, dt);
                }  
                
            // Update third-person camera position behind the character
            const charPos = character.entity.getPosition();
            charPos.y += 0.5;
            const charForward = character.entity.forward; 
            const cameraDistance = -0.5; 
            const cameraHeight = 0.5; 

            thirdPersonCameraEntity.setPosition(
                charPos.x - charForward.x * cameraDistance,
                charPos.y + cameraHeight,
                charPos.z - charForward.z * cameraDistance
            );

            thirdPersonCameraEntity.lookAt(charPos);

            // Switch camera when holding down the C key
            if (keyboard.isPressed(pc.KEY_C)) {
                mainCameraEntity.enabled = true;
                thirdPersonCameraEntity.enabled = false;
                
            } else {
                mainCameraEntity.enabled = false;
                thirdPersonCameraEntity.enabled = true;
            }
        });
    });
};
