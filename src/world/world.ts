import { Scene } from "phaser";
import { Camera } from "../camera/camera";
import { GameObject } from "../basics/game-object";

/**
 * World class
 * 
 * Handles the world state
 */
export class World {
    static instance: World;

    public scene!: Scene;
    public camera!: Camera;

    private constructor() {
    }

    public setScene(scene: Scene): void {
        if (this.scene) throw new Error("Scene already set for the world");

        this.scene = scene;
        this.camera = new Camera(this.scene.cameras.main);
    }

    public static getInstance(): World {
        if (!World.instance) {
            World.instance = new World();
        }

        return World.instance;
    }

    public registerDrawable(gameObject: GameObject): void {
        // ...
    }
}