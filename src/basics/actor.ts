import { GameObject } from "./game-object";
import { Camera } from "../camera/camera";
import { Subscription } from "rxjs";

/**
 * Actor
 * 
 * Everything that can be drawn on the screen is an actor.
 */
export abstract class Actor extends GameObject {
    public sprite: any; // TODO

    constructor() {
        super();

        // when the camera moves, we need to re-render the actor or remove it from rendering
        this.world.camera.transform$.subscribe((transform) => {
            this.render();
        });
    }

    public render(): void {
        if (this.inViewport) {
            // do render
        }
        else {
            // remove from render
        }
    }

    private get inViewport(): boolean {
        const cameraPosition = this.world.camera.transform.location;
        const actorPosition = this.transform.location;

        return cameraPosition.subtract(actorPosition).magnitude() < Camera.viewPortSize.magnitude();
    }
}