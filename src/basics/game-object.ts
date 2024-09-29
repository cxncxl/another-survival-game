import { Subject } from "rxjs";
import * as Phaser from "phaser";

import { Vector2 } from "../math/vector2";
import { World } from "../world/world";

/**
 * Game Object
 * 
 * Everything that exists in the game is a game object.
 */
export abstract class GameObject extends Phaser.GameObjects.GameObject {    
    public abstract onReady(): void;
    public abstract onUpdate(): void;

    private _transform: Transform = {
        location: Vector2.infinity(), // default to infinity so it is not rendered
        rotation: 0,
        scale: Vector2.one()
    }

    public get transform(): Transform {
        return this._transform;
    }

    public transform$: Subject<Transform> = new Subject<Transform>();

    protected world: World;

    constructor() {
        super(
            World.getInstance().scene,
            'custom'
        );

        this.world = World.getInstance();
    }

    setTransform(location: Vector2, rotation: number, scale: Vector2): void {
        this._transform.location = location;
        this._transform.rotation = rotation;
        this._transform.scale = scale;

        this.transform$.next(this._transform);
    }

    setLocation(location: Vector2): void {
        this._transform.location = location

        this.transform$.next(this._transform);
    }

    setRotation(rotation: number): void {
        this._transform.rotation = rotation;

        this.transform$.next(this._transform);
    }

    setScale(scale: Vector2): void {
        this._transform.scale = scale;

        this.transform$.next(this._transform);
    }

    public instantiate(): void {
    }

    public destroy(): void {
        // Remove from game
    }

    update() {
        this.onUpdate();
    }


}

type Transform = {
    location: Vector2;
    rotation: number; // since we're in 2D, we only need one rotation
    scale: Vector2;
};