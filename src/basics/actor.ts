import { GameObject } from "./game-object";
import { Camera } from "../camera/camera";

import * as Phaser from "phaser";
import { Vector2 } from "../math/vector2";
import { Subject } from "rxjs";

/**
 * Actor
 * 
 * Everything that can be drawn on the screen is an actor.
 */
export abstract class Actor extends GameObject {
    public sprite!: Phaser.GameObjects.Sprite;
    protected rendered: boolean = false;

    private renderedSubject: Subject<Actor> = new Subject<Actor>();
    public rendered$ = this.renderedSubject.asObservable();

    get size() {
        return {
            source: {
                px: {
                    width: this.sprite.width,
                    height: this.sprite.height
                },
                percentage: {
                    width: this.sprite.width / this.world.scene.game.canvas.width,
                    height: this.sprite.height / this.world.scene.game.canvas.height
                },
            },
            scaled: {
                px: {
                    width: this.sprite.width * this.transform.scale.x,
                    height: this.sprite.height * this.transform.scale.y
                },
                percentage: {
                    width: this.sprite.width * this.transform.scale.x / this.world.scene.game.canvas.width,
                    height: this.sprite.height * this.transform.scale.y / this.world.scene.game.canvas.height
                },
            }
        }
    }

    constructor(spriteUrl: string) {
        super();

        this.world.scene.loadImage(spriteUrl).subscribe((label) => {
            this.sprite = new Phaser.GameObjects.Sprite(
                this.world.scene, 
                this.transform.location.x, 
                this.transform.location.y, 
                label
            );
            this.world.registerDrawable(this);

            this.transform$.subscribe((transform) => {
                this.sprite.setPosition(transform.location.x, transform.location.y);
                this.sprite.setRotation(transform.rotation);
                this.sprite.setScale(transform.scale.x, transform.scale.y);
            });

            this.onRendered();
            this.renderedSubject.next(this);
        });

        // when the camera moves, we need to re-render the actor or remove it from rendering
        // this.world.camera.transform$.subscribe((transform) => {
        //     this.render();
        // });
    }

    public render(): void {
        if (/* this.inViewport && */ !this.rendered) {
            this.world.scene.add.existing(this.sprite);
            this.rendered = true;
        }

        if (!this.inViewport && this.rendered) {
            // this.sprite.();
        }
    }

    public setScaleInPx(width: number, height: number): void {
        const currentSize = new Vector2(this.sprite.width, this.sprite.height);
        const targetSize = new Vector2(width, height);

        const scale = targetSize.divideByVector(currentSize);

        this.setScale(scale);
    }

    public setAnchor(x: number, y: number): void {
        this.sprite.setOrigin(x, y);
    }

    private get inViewport(): boolean {
        const cameraPosition = new Vector2(this.world.camera.x, this.world.camera.y);
        const actorPosition = this.transform.location;

        return cameraPosition.subtract(actorPosition).magnitude() < Camera.viewPortSize.magnitude();
    }

    public abstract onRendered(): void;
}