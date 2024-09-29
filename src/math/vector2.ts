export class Vector2 {
    private _x: number;
    private _y: number;

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    // TODO: implement vector math

    public add(vector: Vector2): Vector2 {
        return new Vector2(this._x + vector.x, this._y + vector.y);
    }

    public subtract(vector: Vector2): Vector2 {
        return new Vector2(this._x - vector.x, this._y - vector.y);
    }

    public multiply(scalar: number): Vector2 {
        return new Vector2(this._x * scalar, this._y * scalar);
    }

    public divide(scalar: number): Vector2 {
        return new Vector2(this._x / scalar, this._y / scalar);
    }

    public divideByVector(vector: Vector2): Vector2 {
        return new Vector2(this._x / vector.x, this._y / vector.y);
    }

    public magnitude(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    public normalize(): Vector2 {
        const mag = this.magnitude();
        return new Vector2(this._x / mag, this._y / mag);
    }

    public dot(vector: Vector2): number {
        return this._x * vector.x + this._y * vector.y;
    }

    public distance(vector: Vector2): number {
        return this.subtract(vector).magnitude();
    }

    public angle(vector: Vector2): number {
        return Math.acos(this.dot(vector) / (this.magnitude() * vector.magnitude()));
    }

    public rotate(angle: number): Vector2 {
        return new Vector2(
            this._x * Math.cos(angle) - this._y * Math.sin(angle),
            this._x * Math.sin(angle) + this._y * Math.cos(angle)
        );
    }

    public static zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public static one(): Vector2 {
        return new Vector2(1, 1);
    }

    public static infinity(): Vector2 {
        return new Vector2(Infinity, Infinity);
    }

    public static fromAngle(angle: number): Vector2 {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    public static fromArray(arr: [number, number]): Vector2 {
        return new Vector2(arr[0], arr[1]);
    }

    public toString(): string {
        return `(${this._x}, ${this._y})`;
    }

    public toJSON() {
        return {
            x: this._x,
            y: this._y
        }
    }
}