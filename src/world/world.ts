import { Scene } from "phaser";
import { Camera } from "../camera/camera";

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
        this.camera = new Camera(this.scene.cameras.main);
    }

    public static getInstance(): World {
        if (!World.instance) {
            World.instance = new World();
        }

        return World.instance;
    }
}