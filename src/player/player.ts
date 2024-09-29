import { Pawn } from "../basics/pawn";
import { PlayerController } from "./player.controller";

/**
 * Player game object
 */
export class Player extends Pawn {
    public socketId?: string;
    public nickname?: string;

    public characteristics?: {
        health: number;
        attack: number;
        defense: number;
        speed: number;
        // ... more characteristics
    };

    constructor() {
        super('player', PlayerController.getInstance());

        // this.socket = ... connect to socket
        // this.name, this.characteristics = ... pull user data from API
    }

    override onReady() {}
    override onUpdate() {}
}