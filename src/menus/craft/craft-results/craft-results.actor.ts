import { BehaviorSubject, delay } from "rxjs";
import { Actor } from "../../../basics/actor";
import { TextActor } from "../../../ui-elements/text.actor";
import { Vector2 } from "../../../math/vector2";
import { CraftResult } from "../../shared/model/craft.model";
import { ImageActor } from "../../../ui-elements/image.actor";
import { environment } from "../../../env/environment";

export class CraftResults extends Actor {
    private _craftState: 'empty' | 'loading' | 'loaded' = 'empty';
    private state$: BehaviorSubject<typeof this._craftState> = new BehaviorSubject<typeof this._craftState>('empty');

    private crafted?: CraftResult; 

    set craftState(value: typeof this._craftState) {
        this._craftState = value;
        this.state$.next(value);
    }

    private details: {
        label?: TextActor,
        description?: TextActor,
        durability?: TextActor,
        quality?: TextActor,
        image?: ImageActor,
        loading?: TextActor // then will be just Actor with loading spinner
    } = {};

    constructor() {
        super('gamebuild/assets/ui/inventory.png');

        this.rendered$.pipe(delay(100)).subscribe(() => {
            this.setScaleInPx(400, 550);
            
            // this.DEBUG.drawBoundingBox();

            this.state$.subscribe((state) => {
                switch (state) {
                    case 'loading': this.showLoading(); break;
                    case 'loaded': this.showResults(); break;
                    case 'empty': Object.values(this.details).forEach((actor) => actor?.destroy()); break;
                }
            });
        });
    }

    public setInProgress(): void {
        this.craftState = 'loading';
    }

    public clear() {
        this.crafted = undefined;
        this.craftState = 'empty';
    }

    public setCrafted(crafted: CraftResult): void {
        this.crafted = crafted;
        this.craftState = 'loaded';
    }

    private showLoading(): void {
        Object.values(this.details).forEach((actor) => actor?.destroy());

        this.details.loading = new TextActor('Loading...', new Vector2(0, 0));
       
        this.details.loading.uiRendered$.subscribe(() => {
            if (!this.details.loading) return;

            console.log(this.details.loading.size);

            this.details.loading.setLocation(new Vector2(
                    (this.transform.location.x + this.size.scaled.px.width / 2) - (this.details.loading?.size.source.px.width || 0) / 2,
                    this.transform.location.y + this.size.scaled.px.height / 2
                )
            );

            this.details.loading.setParent(this);
            this.details.loading.setAnchor(0.5, 0.5);
            this.details.loading.setFontSize(20);
            this.details.loading.setColor('#fff');
            this.details.loading.setAlign('center');
        });
    }

    private showResults(): void {
        Object.values(this.details).forEach((actor) => actor?.destroy());

        if (!this.crafted) return;

        if (!this.crafted.crafted_item) {
            this.details.label = new TextActor('Craft Failed', new Vector2(0, 0));

            this.details.label.uiRendered$.subscribe(() => {
                if (!this.details.label) return;

                this.details.label.setLocation(new Vector2(
                        (this.transform.location.x + this.size.scaled.px.width / 2) - (this.details.label?.size.source.px.width || 0) / 2,
                        this.transform.location.y + 20
                    )
                );

                this.details.label.setParent(this);
                this.details.label.setAnchor(0.5, 0.5);
                this.details.label.setFontSize(20);
                this.details.label.setColor('#f00');
                this.details.label.setAlign('center');
            });

            this.details.description = new TextActor(this.crafted.message, new Vector2(0, 0));

            this.details.description.uiRendered$.subscribe(() => {
                if (!this.details.description) return;

                this.details.description.setLocation(new Vector2(
                        this.transform.location.x + 10,
                        this.transform.location.y + 20
                    )
                );

                this.details.description.setParent(this);
                this.details.description.setAnchor(0.5, 0.5);
                this.details.description.setFontSize(16);
                this.details.description.setColor('#fff');
                this.details.description.setAlign('left');
                this.details.description.setWordWrap(this.size.scaled.px.width - 20);
            });

            return;
        }

        const item = this.crafted.crafted_item;

        this.details.label = new TextActor(item.name, new Vector2(0, 0));

        this.details.label.uiRendered$.subscribe(() => {
            if (!this.details.label) return;

            this.details.label.setLocation(new Vector2(
                    (this.transform.location.x + this.size.scaled.px.width / 2) - (this.details.label?.size.source.px.width || 0) / 2,
                    this.transform.location.y + 20
                )
            );

            this.details.label.setParent(this);
            this.details.label.setAnchor(0.5, 0.5);
            this.details.label.setFontSize(20);
            this.details.label.setColor('#fff');
            this.details.label.setAlign('center');
        });

        this.details.image = new ImageActor(environment.ASSETS_URL + item.image_path);

        this.details.image.rendered$.subscribe(() => {
            if (!this.details.image) return;

            this.details.image.setScaleInPx(100, 100);
            this.details.image.setLocation(new Vector2(
                    (this.transform.location.x + this.size.scaled.px.width / 2) - (this.details.image?.size.scaled.px.width || 0) / 2,
                    this.transform.location.y + 100
                )
            );

            this.details.image.setParent(this);
        });

        this.details.description = new TextActor(item.description, new Vector2(0, 0));

        this.details.description.uiRendered$.subscribe(() => {
            if (!this.details.description) return;

            this.details.description.setLocation(new Vector2(
                    this.transform.location.x + 10,
                    this.transform.location.y + 210
                )
            );

            this.details.description.setParent(this);
            this.details.description.setAnchor(0.5, 0.5);
            this.details.description.setFontSize(16);
            this.details.description.setColor('#fff');
            this.details.description.setAlign('left');
            this.details.description.setWordWrap(this.size.scaled.px.width - 20);
        });

        this.details.durability = new TextActor(`Durability: ${(parseFloat(item.durability.value) * 100).toFixed(1)}`, new Vector2(0, 0));

        this.details.durability.uiRendered$.subscribe(() => {
            if (!this.details.durability) return;

            this.details.durability.setLocation(new Vector2(
                    this.transform.location.x + 10,
                    this.transform.location.y + 240
                )
            );

            this.details.durability.setParent(this);
            this.details.durability.setAnchor(0.5, 0.5);
            this.details.durability.setFontSize(12);
            this.details.durability.setColor('#fff');
            this.details.durability.setAlign('left');
        });

        this.details.quality = new TextActor(`Quality: ${(parseFloat(item.quality.value) * 100).toFixed(1)}`, new Vector2(0, 0));

        this.details.quality.uiRendered$.subscribe(() => {
            if (!this.details.quality) return;

            this.details.quality.setLocation(new Vector2(
                    this.transform.location.x + 10,
                    this.transform.location.y + 260
                )
            );

            this.details.quality.setParent(this);
            this.details.quality.setAnchor(0.5, 0.5);
            this.details.quality.setFontSize(12);
            this.details.quality.setColor('#fff');
            this.details.quality.setAlign('left');
        });
    }

    public onReady(): void {}
    public onRendered(): void {}
    public onUpdate(): void {}
}