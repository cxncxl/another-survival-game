import { from, map, mergeMap, Observable } from "rxjs";

export class Service {
    protected token: string;

    constructor() {
        const token = localStorage.getItem('token');

        if (!token) throw new Error('Unauthorized');

        this.token = token;
    }

    protected fetch<T>(url: string, options: RequestInit = {}): Observable<T> {
        const headers = new Headers(options.headers);

        headers.set('Authorization', `Bearer ${this.token}`);

        return new Observable<T>((observer) => {
            from(
                fetch(url, {
                    ...options,
                    headers
                })
            )
            .pipe(
                mergeMap((res) => {
                    if (!res.ok) {
                        observer.error(res.statusText);
                    }

                    return from(res.json()) as Observable<T>;
                })
            )
            .subscribe((data) => {
                observer.next(data);
                observer.complete();
            });
        });
    }
}