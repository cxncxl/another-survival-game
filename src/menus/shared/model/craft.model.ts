export type CraftInput = {
    items: { id: number, amount: number }[];
    description: string;
}

export type Item = {
    image: string;
    name: string;
    id: number;
}

export type ItemDetails = {
    id:                  number;
    type:                string;
    name:                string;
    description:         string;
    physical_properties: PhysicalProperties;
    food_properties:     FoodProperties;
    durability:          Durability;
    quality:             Quality;
    craftable:           Craftable;
    image_url:           string;
}

export type Craftable = {
    value:       number;
    craft_items: any[];
}

export type Durability = {
    value:       string;
    max_value:   string;
    description: string;
}

export type FoodProperties = {
    value:       string;
    fresh:       string;
    poison:      number;
    healing:     number;
    type:        any[];
    description: string;
}

export type PhysicalProperties = {
    weight:             Weight;
    dimensions:         Dimensions;
    fluidity:           Fluidity;
    skill_affects:      Quality;
    physical_condition: Quality;
    flammability:       Quality;
}

export type Dimensions = {
    length: Weight;
    width:  Weight;
    height: Weight;
}

export type Weight = {
    value: string;
    unit:  string;
}

export type Quality = {
    value:       string;
    description: string;
}

export type Fluidity = {
    value:       number;
    description: string;
}
