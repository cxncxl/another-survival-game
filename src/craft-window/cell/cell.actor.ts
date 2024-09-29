import { Subject } from "rxjs";
import { Actor } from "../../basics/actor";

export class InventoryCell extends Actor {
    constructor() {
        super('assets/ui/inventory-cell.png');
    }

    public onRendered(): void {}

    public onReady(): void {}
    public onUpdate(): void {}
}