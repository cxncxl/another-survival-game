export class Service {
    protected token: string;

    constructor() {
        const token = localStorage.getItem('token');

        if (!token) throw new Error('Unauthorized');

        this.token = token;
    }

    protected async fetch(url: string, options: RequestInit = {}): Promise<Response> {
        const headers = new Headers(options.headers);

        headers.set('Authorization', `Bearer ${this.token}`);

        return fetch(url, { ...options, headers });
    }
}