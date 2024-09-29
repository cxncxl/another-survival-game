import { Scene } from "../scene/scene";
// import { Camera } from "../camera/camera";
import { CraftWindow } from "../craft-window/craft.actor";
import { Actor } from "../basics/actor";

/**
 * World class
 * 
 * Handles the world state
 */
export class World {
    static instance: World;

    public scene!: Scene;
    public camera!: Phaser.Cameras.Scene2D.Camera;

    private constructor() {
    }

    public setScene(scene: Scene): void {
        if (this.scene) throw new Error("Scene already set for the world");

        this.scene = scene;
        this.camera = this.scene.cameras.main;

        this.initiate();
    }

    public static getInstance(): World {
        if (!World.instance) {
            World.instance = new World();
        }

        return World.instance;
    }

    public registerDrawable(drawable: Actor): void {
        drawable.render();
    }

    private initiate() {
        const craft = new CraftWindow();
    }
}