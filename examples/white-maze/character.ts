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

    const scale = 0.01;
    this.entity.setLocalScale(scale, scale, scale);

    this.entity.addComponent("animation", {
      assets: [assets.charIdleAnimationAsset, assets.charRunAnimationAsset],
    });
    this.currentAnim = assets.charIdleAnimationAsset.name;

    const material = this.entity.model?.meshInstances[0].material as pc.StandardMaterial;
    material.diffuseMap = assets.charTextureAsset.resource;
  }

  updateMovement(charMovement: pc.Vec3, keyboard: pc.Keyboard, charSpeed: number, dt: number) {
    if (keyboard.isPressed(pc.KEY_W)) {
      charMovement.z -= charSpeed * dt;
    }
    if (keyboard.isPressed(pc.KEY_S)) {
      charMovement.z += charSpeed * dt;
    }
    if (keyboard.isPressed(pc.KEY_A)) {
      charMovement.x -= charSpeed * dt;
    }
    if (keyboard.isPressed(pc.KEY_D)) {
      charMovement.x += charSpeed * dt;
    }

    this.entity.translate(charMovement);

    if (charMovement.length() > 0) {
      const angle = Math.atan2(charMovement.x, charMovement.z);
      this.entity.setEulerAngles(0, angle * pc.math.RAD_TO_DEG, 0);
    }
    charMovement.set(0, 0, 0);

    const moved = keyboard.isPressed(pc.KEY_W) || keyboard.isPressed(pc.KEY_S) || keyboard.isPressed(pc.KEY_A) || keyboard.isPressed(pc.KEY_D);
    if (moved && this.currentAnim === this.assets.charIdleAnimationAsset.name) {
      this.entity.animation?.play(this.assets.charRunAnimationAsset.name, 0.1);
      this.currentAnim = this.assets.charRunAnimationAsset.name;
    }
    else if (!moved && this.currentAnim === this.assets.charRunAnimationAsset.name) {
      this.entity.animation?.play(this.assets.charIdleAnimationAsset.name, 0.1);
      this.currentAnim = this.assets.charIdleAnimationAsset.name;
    }
  }
}
