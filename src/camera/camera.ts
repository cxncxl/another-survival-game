import { GameObject } from "../basics/game-object";
import { Vector2 } from "../math/vector2";

/**
 * Game Object-like wrapper for Phaser's Camera
 */
export class Camera extends GameObject {
    public static viewPortSize = new Vector2(800, 600);

    private _camera: Phaser.Cameras.Scene2D.Camera;

    public get camera(): Phaser.Cameras.Scene2D.Camera {
        return this._camera;
    }

    constructor(camera: Phaser.Cameras.Scene2D.Camera) {
        super();

        this._camera = camera;
    }

    public onReady(): void {}
    public onUpdate(): void {}
}