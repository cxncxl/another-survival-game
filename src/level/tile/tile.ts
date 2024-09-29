import { Actor } from "../../basics/actor";
import { TileData } from "./tile.model";

export class Tile extends Actor {
    public tileData: TileData;

    constructor(data: TileData) {
        super(data.texture);

        this.tileData = data;
    }

    public onReady(): void {}
    public onUpdate(): void {}
    public onRendered(): void {}
}