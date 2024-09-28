import { Scene as PhaserScene } from "phaser";
import { Subject } from "rxjs";

/**
 * Wrapper class for Phaser Scene
 */
export class Scene extends PhaserScene {
    public ready$: Subject<boolean> = new Subject();

    preload() {}

    create() {
        this.cameras.add(0, 0, 800, 600); // TODO: move to config

        this.ready$.next(true);
    }
}