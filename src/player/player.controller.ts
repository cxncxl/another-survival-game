import { Controller } from "../basics/controller";

/**
 * Player controller
 * 
 * controlles movement, actions, interactions, etc of the player
 */
export class PlayerController extends Controller {
    public static instance: PlayerController;

    // this one is a singleton
    private constructor() {
        super();

        this.addBindings();
    }

    public static getInstance(): PlayerController {
        if (!PlayerController.instance) {
            PlayerController.instance = new PlayerController();
        }

        return PlayerController.instance;
    }

    /**
     * @todo pull buttons from settings
    */ 
    private addBindings() {
        this.world.scene.input.keyboard?.addKey('W').on('down', this.moveUp);
        this.world.scene.input.keyboard?.addKey('S').on('down', this.moveDown);
        this.world.scene.input.keyboard?.addKey('A').on('down', this.moveLeft);
        this.world.scene.input.keyboard?.addKey('D').on('down', this.moveRight);
    }

    onReady(): void {}
    onUpdate(): void {}
}