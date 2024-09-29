import { ChunkData } from "./tile/chunk.model";
import { Tile } from "./tile/tile";
import { TileData } from "./tile/tile.model";

/**
 * Represents a game level (world / map / etc)
 * 
 * Creates tiles at given positions with given characteristics
 */
export class Level {
    private _tiles: Tile[] = [];

    constructor() {
        // ...
    }

    static fromTileData(levelData: TileData[]) {
        const level = new Level();

        levelData.forEach((tileData) => {
            const tile = new Tile(tileData);
            level.addTile(tile);
        });

        return level;
    }

    static fromChunkData(chunkData: ChunkData[]) {
        const level = new Level();

        chunkData.forEach((chunk) => {
            chunk.tiles.forEach((tileData) => {
                const tile = new Tile(tileData);
                level.addTile(tile);
            });
        });

        return level;
    }

    public addTile(tile: Tile): void {
        this._tiles.push(tile);
    }

    public removeTile(tile: Tile): void {
        const index = this._tiles.indexOf(tile);

        if (index > -1) {
            this._tiles.splice(index, 1);
        }
    }
}