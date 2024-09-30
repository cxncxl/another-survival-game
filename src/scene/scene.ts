import { Scene as PhaserScene } from "phaser";
import { delay, from, Observable, of, Subject } from "rxjs";
import * as Phaser from "phaser";

/**
 * Wrapper class for Phaser Scene
 */
export class Scene extends PhaserScene {
    public ready$: Subject<boolean> = new Subject();

    // url => label
    private loadedImages: Record<string, string> = {};

    preload() {}

    create() {
        this.cameras.add(0, 0, 800, 600); // TODO: move to config

        this.ready$.next(true);
    }

    loadImage(url: string): Observable<string> {
        return from(
            new Promise<string>((resolve) => {
                if (this.loadedImages[url]) {
                    return resolve(this.loadedImages[url]);
                            // .pipe(delay(50)); // hack. delay to make sure the image is loaded. TODO: find a better way
                }

                const uniqueLabel = `image-${Object.keys(this.loadedImages).length}`;
                const load = new Phaser.Loader.LoaderPlugin(this);

                load.image(uniqueLabel, url);
                load.once(Phaser.Loader.Events.COMPLETE, () => {
                    resolve(uniqueLabel)
                });
                load.start();

                this.loadedImages[url] = uniqueLabel;

                return uniqueLabel;
            })
        );
    }
}