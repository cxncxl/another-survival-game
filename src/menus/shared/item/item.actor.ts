import { zip } from "rxjs";
import { Actor } from "../../../basics/actor";
import { Vector2 } from "../../../math/vector2";
import { InventoryItemDetails } from "../item-details/item-details.actor";
import { ItemDetailsService } from "../item-details/item-details.service";
import { Item } from "../model/craft.model";

export class InventoryItem extends Actor {
    quantity: number = 1;
    
    private quantityText?: Phaser.GameObjects.Text;
    private detailsActor: InventoryItemDetails;

    constructor(
        itemData: Item
    ) {
        super(itemData.image);

        this.detailsActor = new InventoryItemDetails();
        this.detailsActor.setParent(this);
        zip(this.rendered$, this.detailsActor.rendered$).subscribe(() => {
            this.detailsActor.setAnchor(0.5, 0);

            this.sprite.setInteractive();
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
        });

        this.rendered$.subscribe(() => {
        });
    }

    public setQuantity(quantity: number) {
        this.quantity = quantity;

        if (this.quantityText) {
            this.quantityText.setText(this.quantity.toString());
            return;
        }
        
        this.addQuantityText();
    }

    private addQuantityText() {
        if (!this.parent) return;

        this.quantityText = this.world.scene.add.text(
            this.transform.location.x + ((this.parent as Actor).size.scaled.px.width) - 15,
            this.transform.location.y + ((this.parent as Actor).size.scaled.px.height) - 12,
            this.quantity.toString(),
            {
                fontSize: '12px',
                color: '#ccc'
            }
        );

        this.quantityText.setBackgroundColor('#000');
        this.quantityText.setPadding(2, 2, 2, 2);
    }

    onRendered() {}
    onReady() {}
    onUpdate() {}
}