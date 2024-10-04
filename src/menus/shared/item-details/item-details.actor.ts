import { Subscription } from "rxjs";
import { Actor } from "../../../basics/actor";
import { ItemDetailsService } from "./item-details.service";

export class InventoryItemDetails extends Actor {
    private service: ItemDetailsService = new ItemDetailsService();

    private details:
    {
        label?: Phaser.GameObjects.Text,
        description?: Phaser.GameObjects.Text,
        type?: Phaser.GameObjects.Text,
        quality?: Phaser.GameObjects.Text,
        loading?: Phaser.GameObjects.Text
    } = {
        label: undefined,
        description: undefined,
        type: undefined,
        quality: undefined,
        loading: undefined
    };

    private getItemDetailsSubscription?: Subscription;

    constructor() {
        super('gamebuild/assets/ui/inventory-item-details.png');

        this.rendered$.subscribe(() => this.hide());
    }

    public setDetails(itemId: number) {
        this.details.loading = this.world.scene.add.text(
            this.transform.location.x,
            this.transform.location.y + (this.size.scaled.px.height * 0.075),
            'Loading...',
            {
                fontSize: '12px',
                color: '#ccc',
                align: 'center'
            }
        );
        this.details.loading.setOrigin(0.5, 0);

        this.getItemDetailsSubscription = this.service.getItemDetails(itemId).subscribe((details) => {
            if (this.details.loading) this.details.loading.destroy();

            this.details.label = this.world.scene.add.text(
                this.transform.location.x,
                this.transform.location.y + (this.size.scaled.px.height * 0.075),
                details.name,
                {
                    fontSize: '14px',
                    color: '#fff',
                    align: 'center'
                }
            );
            this.details.label.setWordWrapWidth(this.size.scaled.px.width - 10);
            this.details.label.setOrigin(0.5, 0);

            this.details.type = this.world.scene.add.text(
                this.transform.location.x - (this.size.scaled.px.width / 2) + 5,
                this.transform.location.y + (this.size.scaled.px.height * 0.25),
                `Тип: ${details.type}`,
                {
                    fontSize: '10px',
                    color: '#ccc'
                }
            );
            this.details.type.setWordWrapWidth(this.size.scaled.px.width - 10);

            this.details.quality = this.world.scene.add.text(
                this.transform.location.x - (this.size.scaled.px.width / 2) + 5,
                this.transform.location.y + (this.size.scaled.px.height * 0.35),
                `Якість: ${(parseFloat(details.quality.value) * 100).toFixed(0)} %`,
                {
                    fontSize: '10px',
                    color: '#ccc'
                }
            );
            this.details.quality.setWordWrapWidth(this.size.scaled.px.width - 10);

            this.details.description = this.world.scene.add.text(
                this.transform.location.x - (this.size.scaled.px.width / 2) + 5,
                this.transform.location.y + (this.size.scaled.px.height * 0.5),
                details.description,
                {
                    fontSize: '12px',
                    color: '#ccc'
                }
            );
            this.details.description.setWordWrapWidth(this.size.scaled.px.width - 10);
        });
    }

    public hideDetails() {
        Object.keys(this.details).forEach((key) => {
            const k = key as keyof typeof this.details;
            if (this.details[k]) {
                this.details[k].destroy();
                this.details[k] = undefined;
            }
        });

        if (this.getItemDetailsSubscription) this.getItemDetailsSubscription.unsubscribe();
    }
        

    public onRendered(): void {}
    public onReady(): void {}
    public onUpdate(): void {}
}