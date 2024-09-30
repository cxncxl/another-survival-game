import { concatMap, from, Observable, Subject } from "rxjs";
import { Actor } from "../basics/actor";
import { CONFIG } from "../config";
import { Vector2 } from "../math/vector2";
import { InventoryCell } from "./cell/cell.actor";
import { CraftService } from "./craft.service";

export class CraftWindow extends Actor {
    private service: CraftService;

    private readonly BORDERS = {
        top: 2,
        left: 2,
        right: 2,
        bottom: 7
    };

    private readonly PADDING = 1;
    
    private cells: InventoryCell[] = [];

    scaleFactor = new Vector2(1, 1);

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

        this.addCells();
    }

    private addCells(): void {
        const gridWidth = 7;
        const gridHeight = 14;
        
        const cellsLoadingQueue = new Subject<Observable<any>>(); 

        for (let w = 0; w < gridWidth; w++) {
            for (let h = 0; h < gridHeight; h++) {
                cellsLoadingQueue.next(
                    from(
                        new Promise<void>((resolve) => {
                            const cell = new InventoryCell();
        
                            cell.rendered$.subscribe(() => {
                                cell.setScale(new Vector2(1.25, 1.25));
            
                                const cellWidth = cell.size.scaled.px.width;
                                const cellHeight = cell.size.scaled.px.height;
            
                                cell.setAnchor(0, 0);
            
                                const cellLocation = new Vector2(
                                    this.transform.location.x + (this.BORDERS.left * this.scaleFactor.x) + (this.PADDING * this.scaleFactor.x) + (w * cellWidth) + 48,
                                    this.transform.location.y + (this.BORDERS.top * this.scaleFactor.y) + (this.PADDING * this.scaleFactor.y) + (h * cellHeight) + 42
                                );
            
                                cell.setLocation(cellLocation);
            
                                this.cells.push(cell);

                                if (this.cells.length === gridWidth * gridHeight) {
                                    resolve();
                                }
                            });
                        })
                    )
                )
            }
        }
        cellsLoadingQueue
        // .pipe(
        //     concatMap((operation$) => operation$)
        // )
        .subscribe(() => {
            this.cells = [...this.cells.sort((a, b) => {
                if (a.transform.location.y < b.transform.location.y) {
                    return -1;
                }
                if (a.transform.location.y > b.transform.location.y) {
                    return 1;
                }
                if (a.transform.location.x < b.transform.location.x) {
                    return -1;
                }
                if (a.transform.location.x > b.transform.location.x) {
                    return 1;
                }
                return 0;
            })];

            this.addItems();
        });

    }

    private addItems(): void {
        this.service.getAllItems().subscribe(async (items) => {
            for (let i = 0; i < this.cells.length; i++) {
                const item = items[i];

                if (item) this.cells[i].setItem(item);
            }
        });
    }

    public onReady(): void {}

    public onUpdate(): void {}

}