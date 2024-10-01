import { Observable, concatMap, of } from "rxjs";
import { Actor } from "../../basics/actor";
import { InventoryCell } from "../shared/cell/cell.actor";
import { Vector2 } from "../../math/vector2";
import { InventoryService } from "./inventory.service";

export class Inventory extends Actor {
    inventory: InventoryCell[] = [];

    private service: InventoryService;

    constructor() {
        super('gamebuild/assets/ui/inventory.png');

        this.service = new InventoryService();
    }

    private addInventory(): void {
        const gridWidth = 7;
        const gridHeight = 14;
        
        new Observable<InventoryCell>((observer) => {
            for (let h = 0; h < gridHeight; h++) {
                for (let w = 0; w < gridWidth; w++) {
                    const cell = new InventoryCell();
            
                    cell.rendered$.subscribe(() => {
                        cell.setScale(new Vector2(1.25, 1.25));

                        const cellWidth = cell.size.scaled.px.width;
                        const cellHeight = cell.size.scaled.px.height;

                        cell.setAnchor(0, 0);

                        const cellLocation = new Vector2(
                            this.transform.location.x + (w * cellWidth) + 48,
                            this.transform.location.y + (h * cellHeight) + 42
                        );

                        cell.setLocation(cellLocation);

                        observer.next(cell);

                        if (this.inventory.length === gridWidth * gridHeight) {
                            observer.complete();
                        }
                    });
                }
            }
        })
        .pipe(
            concatMap((cell) => of(cell)),
        )
        .subscribe({
            next: this.inventory.push.bind(this.inventory),
            complete: this.addItems.bind(this)
        });

    }

    private addItems(): void {
        this.service.getAllItems().subscribe((items) => {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item) this.inventory[i].setItem(item);
            }
        });
    }

    public onRendered(): void {
        this.addInventory();
    }
    
    public onReady(): void {}
    public onUpdate(): void {}
}