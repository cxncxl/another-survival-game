import { Observable, Subject } from "rxjs";
import { Actor } from "../../../basics/actor";
import { Vector2 } from "../../../math/vector2";
import { InventoryCell } from "../../shared/cell/cell.actor";
import { CraftService } from "../craft.service";
import { CraftResult, Item } from "../../shared/model/craft.model";

export class CraftTable extends Actor {
    private headerLabel?: Phaser.GameObjects.Text;
    private promptLabel?: Phaser.GameObjects.Text;
    private textArea?: Phaser.GameObjects.DOMElement;
    private craftButton?: Phaser.GameObjects.DOMElement;

    private craftPrompt: string = '';

    private cells: InventoryCell[] = [];

    private service: CraftService;
    crafted$: Subject<CraftResult> = new Subject<CraftResult>();
    craftInProgress$: Subject<void> = new Subject<void>();

    constructor() {
        super("gamebuild/assets/ui/craft-table.png");

        this.rendered$.subscribe(() => {
            this.addCells();
        });

        this.service = new CraftService();
    }

    private addCells(): void {
        const gridWidth = 5;
        const gridHeight = 2;

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
                            this.transform.location.x + (w * cellWidth),
                            this.transform.location.y + (h * cellHeight) + 42
                        );

                        cell.setLocation(cellLocation);

                        observer.next(cell);

                        if (this.cells.length === gridWidth * gridHeight) {
                            observer.complete();
                        }
                    });
                }
            }
        }).subscribe({
            next: this.cells.push.bind(this.cells),
            complete: () => {
                this.addLabels();
                this.addTextArea();
                this.addCraftButton();
            }
        })
    }

    private addLabels(): void {
        this.headerLabel = this.world.scene.add.text(
            0,
            0,
            'Ingridients',
            {
                fontSize: '20px',
                color: '#FFFFFF',
                align: 'center'
            }
        );
        this.headerLabel.setOrigin(0.5, 0);
        this.headerLabel.setPosition(
            this.transform.location.x + (this.size.scaled.px.width / 2) + 20, 
            this.transform.location.y - 10
        );

        this.promptLabel = this.world.scene.add.text(
            0,
            0,
            'Prompt',
            {
                fontSize: '16px',
                color: '#FFFFFF',
                align: 'center'
            }
        );
        this.promptLabel.setOrigin(0.5, 0);
        this.promptLabel.setPosition(
            this.transform.location.x + (this.size.scaled.px.width / 2) + 20, 
            this.transform.location.y + this.size.scaled.px.height + 5
        );
    }

    private addTextArea(): void {
        const domTextArea = document.createElement('textarea');
        domTextArea.setAttribute('id', 'craft-text-area');
        domTextArea.setAttribute('placeholder', 'Опишіть рецепт створення предмету');

        this.textArea = this.world.scene.add.dom(
            this.transform.location.x + (this.size.scaled.px.width / 2) + 20,
            this.transform.location.y + this.size.scaled.px.height + 50,
            domTextArea
        );
        this.textArea.setOrigin(0.5, 0);
        this.textArea.setScrollFactor(0);
    }

    private addCraftButton(): void {
        const domButton = document.createElement('button');
        domButton.setAttribute('id', 'craft-button');
        domButton.innerText = 'Craft';

        this.craftButton = this.world.scene.add.dom(
            this.transform.location.x + (this.size.scaled.px.width / 2) + 20,
            this.transform.location.y + this.size.scaled.px.height + 335,
            domButton
        );
        this.craftButton.setOrigin(0.5, 0);

        this.craftButton.addListener('click');
        this.craftButton.on('click', () => {
            if (!this.craftButton) return;
            if (!this.textArea) return;

            this.craftPrompt = (document.getElementById('craft-text-area') as HTMLTextAreaElement).value || '';

            if (!this.craftPrompt) return;

            const items = this.cells.filter((cell) => cell.item).map((cell) => cell.item?.itemData);

            if (!items) return;
            if (items.length === 0) return;

            this.craftInProgress$.next();
            this.service.craft({
                items: items as Item[],
                description: this.craftPrompt
            }).subscribe((item) => {
                this.crafted$.next(item);
            });
        });
    }

    public onRendered(): void {}
    public onReady(): void {}
    public onUpdate(): void {}
}