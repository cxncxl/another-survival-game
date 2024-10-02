import { Scene } from "../scene/scene";
// import { Camera } from "../camera/camera";
import { CraftWindow } from "../menus/craft/craft.actor";
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

    private drawables: Actor[] = [];

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

        this.drawables.push(drawable);
    }

    public findClosestActor(x: number, y: number): Actor | undefined {
        let closestActor: Actor | undefined;
        let closestDistance = Number.MAX_VALUE;

        this.drawables.forEach((actor) => {
            const distance = Phaser.Math.Distance.Between(x, y, actor.transform.location.x, actor.transform.location.y);

            if (distance < closestDistance) {
                closestActor = actor;
                closestDistance = distance;
            }
        });

        return closestActor;
    }

    public findClosestActorOfType<T extends Actor>(x: number, y: number, type: new () => T): T | undefined {
        let closestActor: T | undefined;
        let closestDistance = Number.MAX_VALUE;

        this.drawables.forEach((actor) => {
            if (actor instanceof type) {
                const distance = Phaser.Math.Distance.Between(x, y, actor.transform.location.x, actor.transform.location.y);

                if (distance < closestDistance) {
                    closestActor = actor as T;
                    closestDistance = distance;
                }
            }
        });

        return closestActor;
    }

    private initiate() {
        const craft = new CraftWindow();
    }
}