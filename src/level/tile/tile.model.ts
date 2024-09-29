export type TileData = {
    texture: string;
    resources: any[]; // TODO: specify type
    durability: number;
    location: { x: number, y: number }; // relative to chunk
};