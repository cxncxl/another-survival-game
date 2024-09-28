import { CONFIG } from "./config";
import { Scene } from "./scene/scene";
import { World } from "./world/world";

const scene = new Scene();

scene.ready$.subscribe(() => {
    const world = World.getInstance();
    world.setScene(scene);
});

const gameConfig = {
    type: Phaser.AUTO,
    width: CONFIG.GAME_WINDOW.WIDTH,
    height: CONFIG.GAME_WINDOW.HEIGHT,
    scene: scene,
    parent: "game-container"
}

const game = new Phaser.Game(gameConfig);