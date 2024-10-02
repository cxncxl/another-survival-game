import { zip } from "rxjs";
import { Actor } from "../../../basics/actor";
import { Vector2 } from "../../../math/vector2";
import { InventoryItemDetails } from "../item-details/item-details.actor";
import { ItemDetailsService } from "../item-details/item-details.service";
import { Item } from "../model/craft.model";
import { InventoryCell } from "../cell/cell.actor";
import { TextActor } from "../../../ui-elements/text.actor";

export class InventoryItem extends Actor {
    quantity: number = 1;
    
    private quantityText?: Phaser.GameObjects.Text;
    private detailsActor: InventoryItemDetails;

    private beforeDragLocation?: Vector2;
    private dragMode: 'ctrl' | 'regular' = 'regular';

    private shiftKey = this.world.scene.input.keyboard?.addKey('SHIFT');

    constructor(
        public itemData: Item
    ) {
        super(itemData.image);
        
        this.detailsActor = new InventoryItemDetails();
        this.detailsActor.setParent(this);
        zip(this.rendered$, this.detailsActor.rendered$).subscribe(() => {
            this.detailsActor.setAnchor(0.5, 0);

            this.sprite.setInteractive({ draggable: true });
            this.sprite.addListener('pointerover', () => {
                this.detailsActor.setDetails(itemData.id);
                this.detailsActor.show();
                this.detailsActor.setScaleInPx(200, 200);
                this.detailsActor.setLocation(this.transform.location.add(
                    new Vector2(
                        0, 
                        this.size.scaled.px.height * 1.25
                    )
                ));
            });

            this.sprite.addListener('pointerout', () => {
                this.detailsActor.hideDetails();
                this.detailsActor.hide();
            });

            this.sprite.addListener('dragstart', () => {
                this.detailsActor.hideDetails();
                this.detailsActor.hide();
                this.quantityText?.destroy();

                if (this.shiftKey && this.world.scene.input.keyboard?.checkDown(this.shiftKey)) {
                    this.dragMode = 'ctrl';

                    (this.parent as InventoryCell).removeItem();
                    (this.parent as InventoryCell).setItem({...this.itemData, quantity: this.itemData.quantity - 1});
                }
                else this.dragMode = 'regular';

                this.beforeDragLocation = this.transform.location;
            });

            this.sprite.addListener('drag', (pointer: null, dragX: number, dragY: number) => {
                this.setLocation(new Vector2(dragX, dragY));
            });

            this.sprite.addListener('dragend', (pointer: null, dragX: number, dragY: number) => {
                const closestCell = this.world.findClosestActorOfType<InventoryCell>(this.transform.location.x, this.transform.location.y, InventoryCell);

                if (closestCell) {
                    if (this.dragMode === 'regular') (this.parent as InventoryCell).removeItem();

                    closestCell.setItem(this.dragMode === 'regular' ? this.itemData : {...this.itemData, quantity: 1});

                    this.destroy();
                }
                else if (this.beforeDragLocation) {
                    this.setLocation(this.beforeDragLocation);
                }

                this.beforeDragLocation = undefined;
                this.setQuantity(this.itemData.quantity);
            });
        });

        this.rendered$.subscribe(() => {
            this.setQuantity(this.itemData.quantity);
        });
    }

    public setQuantity(quantity: number) {
        this.quantity = quantity;
        this.itemData.quantity = quantity;

        if (this.quantityText) this.quantityText.destroy();
        this.addQuantityText();
    }

    private addQuantityText() {
        if (!this.parent) return;
        if (this.quantity <= 1) return;

        this.quantityText = this.world.scene.add.text( 
            this.transform.location.x + ((this.parent as Actor).size.scaled.px.width) - 15,
            this.transform.location.y + ((this.parent as Actor).size.scaled.px.height) - 12,
            this.quantity.toString(),
            {
                fontSize: '12px',
                color: '#fff',
                align: 'center',
                backgroundColor: '#000',
                padding: {
                    x: 2,
                    y: 2
                }
            }
        );

        this.transform$.subscribe((transform) => {
            this.quantityText?.setPosition(
                transform.location.x + ((this.parent as Actor).size.scaled.px.width) - 15,
                transform.location.y + ((this.parent as Actor).size.scaled.px.height) - 12
            );
        });
    }

    onRendered() {}
    onReady() {}
    onUpdate() {}
}