import { Subject, Subscription } from "rxjs";
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

    public parent?: GameObject;

    protected children: GameObject[] = [];

    private _transform: Transform = {
        location: Vector2.infinity(), // default to infinity so it is not rendered
        rotation: 0,
        scale: Vector2.one()
    }

    private parentOffset?: {
        location: Vector2,
        rotation: number,
        scale: Vector2
    };

    private parentTransformSubscription?: Subscription;   

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

    setParent(parent: GameObject, copyLocation: boolean = false): void {
        this.parent = parent;
        this.parentOffset = {
            location: this.transform.location.subtract(parent.transform.location),
            rotation: this.transform.rotation - parent.transform.rotation,
            scale: this.transform.scale.divideByVector(parent.transform.scale)
        };

        if (copyLocation) {
            this.setLocation(parent.transform.location);
            this.parentOffset.location = Vector2.zero();
        }

        this.parentTransformSubscription = this.parent.transform$.subscribe((transform) => {
            if (!this.parentOffset) return;

            this.transform.location = transform.location.add(this.parentOffset.location);
            this.transform.rotation = transform.rotation + this.parentOffset.rotation;
            this.transform.scale = transform.scale.multiplyByVector(this.parentOffset.scale);

            this.transform$.next(this.transform);
        });

        this.parent.onChildAdded(this);
    }

    removeParent() {
        this.parent = undefined;
        this.parentOffset = undefined;
        this.parentTransformSubscription?.unsubscribe();
        this.parentTransformSubscription = undefined;
    }

    protected onChildAdded(child: GameObject) {
        this.children.push(child);
    }

    public destroy(): void {
        this.children.forEach(child => child.destroy());
        this.children = [];

        this.removeParent();
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