import { Actor, EmtpyActor } from "../../basics/actor";
import { Item } from "../model/craft.model";

export class InventoryCell extends Actor {
    public item?: Item;

    constructor() {
        super('gamebuild/assets/ui/inventory-cell.png');
    }

    public setItem(item: Item): void {
        const aItem = new EmtpyActor(item.image);

        aItem.rendered$.subscribe(() => {
            aItem.setScaleInPx(this.size.scaled.px.width, this.size.scaled.px.height);
            aItem.setAnchor(0, 0);
            aItem.setLocation(this.transform.location);
        });

        this.item = item;
    }

    public onRendered(): void {}

    public onReady(): void {}
    public onUpdate(): void {}
}