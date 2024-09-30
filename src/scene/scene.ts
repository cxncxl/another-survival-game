import { Scene as PhaserScene } from "phaser";
import { Observable, of, shareReplay, Subject } from "rxjs";
import * as Phaser from "phaser";

/**
 * Wrapper class for Phaser Scene
 */
export class Scene extends PhaserScene {
    public ready$: Subject<boolean> = new Subject();

    // url => label
    private loadedImages: Record<string, string> = {};
    private ongoingRequests: Record<string, Observable<string>> = {};
    protected loader!: Phaser.Loader.LoaderPlugin;

    preload() {
        this.loader = new Phaser.Loader.LoaderPlugin(this);
    }

    create() {
        this.cameras.add(0, 0, 800, 600); // TODO: move to config

        this.ready$.next(true);
    }

    loadImage(url: string): Observable<string> {
        if (this.loadedImages[url]) {
            return of(this.loadedImages[url]);
        }
    
        if (this.ongoingRequests[url]) {
            return this.ongoingRequests[url];
        }
    
        const loadImage$ = new Observable<string>((observer) => {
            const uniqueLabel = url;
    
            this.loader.image(uniqueLabel, url);
            this.loader.once(`filecomplete-image-${uniqueLabel}`, () => {
                this.loadedImages[url] = uniqueLabel;
    
                observer.next(uniqueLabel);
                observer.complete();
    
                delete this.ongoingRequests[url];
            });
            this.loader.start();
        }).pipe(shareReplay(1));
    
        this.ongoingRequests[url] = loadImage$;
    
        return loadImage$;
    }
}