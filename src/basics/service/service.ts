import { from, Observable } from "rxjs";

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

        return from(
            (async () => {
                return await (await fetch(url, { ...options, headers })).json()
            })()
        );
    }
}