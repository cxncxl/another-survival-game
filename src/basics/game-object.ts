import { Observable, of, Subject } from "rxjs";
import { Vector2 } from "../math/vector2";
import { World } from "../world/world";

/**
 * Game Object
 * 
 * Everything that exists in the game is a game object.
 */
export abstract class GameObject {    
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

    protected world!: World;

    constructor() {
        this.world = World.getInstance();
    }

    public instantiate(): void {
    }

    public destroy(): void {
        // Remove from game
    }
}

type Transform = {
    location: Vector2;
    rotation: number; // since we're in 2D, we only need one rotation
    scale: Vector2;
};