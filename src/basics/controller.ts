import { GameObject } from "./game-object";

/**
 * Controller base class
 * 
 * Always attached to everything that can move either by player input or AI, or anything else
 */
export abstract class Controller extends GameObject {
    public moveUp(): void {}
    public moveDown(): void {}
    public moveLeft(): void {}
    public moveRight(): void {}
    public jump(): void {}

    abstract onReady(): void;
    abstract onUpdate(): void;
}