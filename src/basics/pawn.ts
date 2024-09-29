import { Actor } from "./actor";
import { Controller } from "./controller";
import { GameObject } from "./game-object";

/**
 * Pawn
 * 
 * A game object that can move / attack / etc
 */
export class Pawn extends Actor {
    protected controller: Controller;

    constructor(spriteLabel: string, controller: Controller) {
        super(spriteLabel);

        this.controller = controller;

        this.onReady();
    }

    override onRendered() {}
    override onReady() {}
    override onUpdate() {}
}