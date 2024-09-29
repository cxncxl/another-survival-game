import { TileData } from "./tile.model";

export type ChunkData = {
    location: { x: number, y: number };
    tiles: TileData[];
}