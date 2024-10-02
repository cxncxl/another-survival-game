import { ReplaySubject } from "rxjs";
import { Actor } from "../basics/actor";
import { Vector2 } from "../math/vector2";
import { UIConfig } from "./ui.config";

export class TextActor extends Actor {
    private text!: Phaser.GameObjects.Text;

    public uiRendered$ = new ReplaySubject<void>();

    constructor(
        text: string,
        location: Vector2
    ) {
        super('gamebuild/assets/ui/empty.png');

        this.rendered$.subscribe(() => {
            this.text = this.scene.add.text(location.x, location.y, text, {
                fontFamily: UIConfig.fontFamily,
                fontSize: UIConfig.fontSize,
                color: UIConfig.textColor
            });

            this.uiRendered$.next();
        });
    }

    public setText(text: string): void {
        this.rendered$.subscribe(() => {
            this.text.setText(text);
        });
    }

    public setOrigin(x: number, y: number): void {
        this.rendered$.subscribe(() => {
            this.text.setOrigin(x, y);
        });
    }

    public setFontSize(size: number): void {
        this.rendered$.subscribe(() => {
            this.text.setFontSize(size);
        });
    }

    public setFontFamily(family: string): void {
        this.rendered$.subscribe(() => {
            this.text.setFontFamily(family);
        });
    }

    public setColor(color: string): void {
        this.rendered$.subscribe(() => {
            this.text.setColor(color);
        });
    }

    public setWordWrap(width: number): void {
        this.rendered$.subscribe(() => {
            this.text.setWordWrapWidth(width);
        });
    }

    public setPadding(x: number, y: number): void {
        this.rendered$.subscribe(() => {
            this.text.setPadding(x, y);
        });
    }

    public setBackgroundColor(color: string): void {
        this.rendered$.subscribe(() => {
            this.text.setBackgroundColor(color);
        });
    }

    public destroy(): void {
        this.text.destroy();
    }

    public onRendered(): void {}
    public onReady(): void {}
    public onUpdate(): void {}
}