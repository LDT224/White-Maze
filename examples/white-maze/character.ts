import * as pc from "playcanvas";

export class Character {
  entity: pc.Entity;
  app: pc.Application;
  assets: any;
  currentAnim: string;

  constructor(app: pc.Application, assets: any) {
    this.app = app;
    this.assets = assets;

    this.entity = new pc.Entity("Character");
    app.root.addChild(this.entity);
    this.entity.addComponent("model", {
      type: "asset",
      asset: assets.charModelAsset
    });

    const scale = 0.005;
    this.entity.setLocalScale(scale, scale, scale);

    this.entity.addComponent("animation", {
      assets: [assets.charIdleAnimationAsset, assets.charRunAnimationAsset],
    });
    this.currentAnim = assets.charIdleAnimationAsset.name;

    // Add rigid body component (dynamic for movement)
    this.entity.addComponent("rigidbody", {
      type: "dynamic",
      mass: 1,
      linearDamping: 0.99, // Prevent excessive sliding
      angularDamping: 0.99, // Prevent spinning out
    });

    // Add collision component (for interactions with the world)
    this.entity.addComponent("collision", {
      type: "box",
      halfExtents: new pc.Vec3(scale/2, scale/2, scale/2), // Adjust based on character model
    });

    const material = this.entity.model?.meshInstances[0].material as pc.StandardMaterial;
    material.diffuseMap = assets.charTextureAsset.resource;
  }

  updateMovement(charMovement: pc.Vec3, keyboard: pc.Keyboard, charSpeed: number, dt: number) {
    const force = new pc.Vec3();
    
    // Move forward with W
    if (keyboard.isPressed(pc.KEY_W)) {
        const forward = this.entity.forward.clone().normalize();  
        force.add(forward.mulScalar(charSpeed * 100));  
    }

    // If there's any force, apply it to the character
    if (force.length() > 0) {
        this.entity.rigidbody?.applyForce(force);
        console.log('Force applied: ', force);  
    }

    // Rotate left with A
    if (keyboard.isPressed(pc.KEY_A)) {
      const rotationSpeed = 90; 
      this.entity.rotate(0, -rotationSpeed * dt, 0);
    }

    // Rotate right with D
    if (keyboard.isPressed(pc.KEY_D)) {
        const rotationSpeed = 90; 
        this.entity.rotate(0, rotationSpeed * dt, 0);
    }

    // Reset the movement vector
    charMovement.set(0, 0, 0)

    // Switch between run and idle animations
    const moved = keyboard.isPressed(pc.KEY_W);
    if (moved && this.currentAnim === this.assets.charIdleAnimationAsset.name) {
        this.entity.animation?.play(this.assets.charRunAnimationAsset.name, 0.1);
        this.currentAnim = this.assets.charRunAnimationAsset.name;
    } else if (!moved && this.currentAnim === this.assets.charRunAnimationAsset.name) {
        this.entity.animation?.play(this.assets.charIdleAnimationAsset.name, 0.1);
        this.currentAnim = this.assets.charIdleAnimationAsset.name;
    }
  }

}
