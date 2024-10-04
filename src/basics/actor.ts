import { GameObject } from "./game-object";
import { Camera } from "../camera/camera";

import * as Phaser from "phaser";
import { Vector2 } from "../math/vector2";
import { ReplaySubject } from "rxjs";

/**
 * Actor
 * 
 * Everything that can be drawn on the screen is an actor.
 */
export abstract class Actor extends GameObject {
    public sprite!: Phaser.GameObjects.Sprite;

    private renderedSubject: ReplaySubject<Actor> = new ReplaySubject<Actor>();
    public rendered$ = this.renderedSubject.asObservable();

    protected rendered: boolean = false;

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

    public setVisible(visible: boolean): void {
        this.sprite.setVisible(visible);
    }

    public hide(): void {
        this.children.forEach((child) => {
            (child as Actor).hide();
        });
        this.setVisible(false);
    }

    public show(): void {
        this.setVisible(true);
    }

    override destroy() {
        this.sprite.destroy();
        
        super.destroy();
    }

    override setLocation(location: Vector2): void {
        super.setLocation(location);

        this.sprite.setPosition(location.x, location.y);
    }

    public DEBUG = {
        drawBoundingBox: () => {
            this.world.scene.add.rectangle(
                this.transform.location.x + this.size.scaled.px.width / 2,
                this.transform.location.y + this.size.scaled.px.height / 2,
                this.size.scaled.px.width,
                this.size.scaled.px.height,
                Math.random() * 0xffffff,
                0.5
            );
        }
    }

    private get inViewport(): boolean {
        const cameraPosition = new Vector2(this.world.camera.x, this.world.camera.y);
        const actorPosition = this.transform.location;

        return cameraPosition.subtract(actorPosition).magnitude() < Camera.viewPortSize.magnitude();
    }

    public abstract onRendered(): void;
}

export class EmtpyActor extends Actor {
    public onReady(): void {}
    public onUpdate(): void {}
    public onRendered(): void {}
}