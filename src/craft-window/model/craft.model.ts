export type CraftInput = {
    items: { id: number, amount: number }[];
    description: string;
}

export type Item = {
    image: string;
    name: string;
    id: number;
}