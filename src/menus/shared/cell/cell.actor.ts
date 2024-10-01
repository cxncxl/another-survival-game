import { Actor, EmtpyActor } from "../../../basics/actor";
import { InventoryItem } from "../item/item.actor";
import { Item } from "../model/craft.model";

export class InventoryCell extends Actor {
    public item?: InventoryItem;

    constructor() {
        super('gamebuild/assets/ui/inventory-cell.png');
    }

    public setItem(item: Item): void {
        const aItem = new InventoryItem(item);
        aItem.setParent(this);

        aItem.rendered$.subscribe(() => {
            aItem.setScaleInPx(this.size.scaled.px.width, this.size.scaled.px.height);
            aItem.setAnchor(0, 0);
            aItem.setLocation(this.transform.location);

            aItem.setQuantity(10);
        });

        this.item = aItem;
    }

    public onRendered(): void {}

    public onReady(): void {}
    public onUpdate(): void {}
}