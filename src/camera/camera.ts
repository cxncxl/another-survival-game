import { GameObject } from "../basics/game-object";
import { CONFIG } from "../config";
import { Vector2 } from "../math/vector2";

/**
 * Game Object-like wrapper for Phaser's Camera
 * 
 * @deprecated
 */
export class Camera extends GameObject {
    public static viewPortSize = new Vector2(CONFIG.GAME_WINDOW.WIDTH, CONFIG.GAME_WINDOW.HEIGHT);

    private _camera: Phaser.Cameras.Scene2D.Camera;

    public get camera(): Phaser.Cameras.Scene2D.Camera {
        return this._camera;
    }

    constructor(phaserCamera: Phaser.Cameras.Scene2D.Camera) {
        super();

        this._camera = phaserCamera;
        this.camera.setViewport(0, 0, Camera.viewPortSize.x, Camera.viewPortSize.y);
    }

    public onReady(): void {}
    public onUpdate(): void {}
}