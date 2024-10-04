import { Actor } from "../basics/actor";

export class ImageActor extends Actor {
    constructor(spriteUrl: string) {
        super(spriteUrl);
    }

    public onRendered(): void {}
    public onReady(): void {}
    public onUpdate(): void {}
}