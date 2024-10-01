import { CONFIG } from "./config";
import { Scene } from "./scene/scene";
import { World } from "./world/world";

const scene = new Scene();

const gameConfig = {
    type: Phaser.AUTO,
    width: CONFIG.GAME_WINDOW.WIDTH,
    height: CONFIG.GAME_WINDOW.HEIGHT,
    scene: scene,
    parent: "game-container",
    pixelArt: true,
    dom: {
        createContainer: true
    },
}

const game = new Phaser.Game(gameConfig);

scene.ready$.subscribe(() => {
    const world = World.getInstance();
    world.setScene(scene);
});