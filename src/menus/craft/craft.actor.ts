import { concatMap, Observable, of } from "rxjs";
import { Actor } from "../../basics/actor";
import { CONFIG } from "../../config";
import { Vector2 } from "../../math/vector2";
import { InventoryCell } from "../shared/cell/cell.actor";
import { CraftService } from "./craft.service";
import { Inventory } from "../inventory/inventory.actor";

export class CraftWindow extends Actor {
    private service: CraftService;

    private readonly BORDERS = {
        top: 2,
        left: 2,
        right: 2,
        bottom: 7
    };

    private readonly PADDING = 1;
    
    private inventory: InventoryCell[] = [];

    scaleFactor = new Vector2(1, 1);
    private inventoryActor?: Inventory;

    constructor() {
        super('gamebuild/assets/ui/craft-window.png');
        
        this.service = new CraftService();
    }

    public onRendered(): void {
        this.setAnchor(0, 0);

        this.setScaleInPx(
            CONFIG.GAME_WINDOW.WIDTH * 0.8,
            CONFIG.GAME_WINDOW.HEIGHT * 0.8
        );

        this.setLocation(new Vector2(
            CONFIG.GAME_WINDOW.WIDTH * 0.1,
            CONFIG.GAME_WINDOW.HEIGHT * 0.1
        ));

        this.scaleFactor = new Vector2(
            this.size.source.px.width / this.sprite.width,
            this.size.source.px.height / this.sprite.height
        );

        this.addInventory();
    }

    private addInventory(): void {
        this.inventoryActor = new Inventory();

        this.inventoryActor.setParent(this);
        this.inventoryActor.rendered$.subscribe(() => {
            if (!this.inventoryActor) return;

            this.inventoryActor.setScale(this.scaleFactor);
            this.inventoryActor.setAnchor(0, 0);
            this.inventoryActor.setLocation(this.transform.location.add(
                new Vector2(
                    this.BORDERS.left + this.PADDING,
                    this.BORDERS.top + this.PADDING
                )
            ));

            const lineColor = 0x594c29;
            const x = this.transform.location.x + (this.size.scaled.px.width * 0.25);
            const line = this.world.scene.add.line(
                50,
                320,
                x,
                this.transform.location.y + this.size.scaled.px.height - 155,
                x,
                this.transform.location.y,
                lineColor
            );
        });
    }

    

    public onReady(): void {}

    public onUpdate(): void {}

}
