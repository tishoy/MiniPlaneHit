/**
 * Created by tishoy on 15/1/31.
 * 每个格子数据
 */
class GridData {
    private _row: number;
    private _column: number;
    public index: number;
    private _gridValue: number;
    private _gridType: number;
    private _direction: number;
    private _bodyType: number;

    constructor() {

    }

    resetGrid(gridValue, gridType = GridTypeEnum.MISS, direction = DirectionTypeEnum.UNSET, bodyType = BodyGridEnum.UNSET) {
        this._gridValue = gridValue;
        this._gridType = gridType;
        this._direction = direction;
        this._bodyType = bodyType;
        this.index = -1;
    }

    public get row(): number {
        return Math.floor(this._gridValue / 9);
    }

    public get column(): number {
        return this._gridValue % 9;
    }

    public get gridValue(): number {
        return this._gridValue;
    }

    public set gridValue(value: number) {
        this._gridValue = value;
    }

    public get gridType(): number {
        return this._gridType;
    }

    public set gridType(value: number) {
        this._gridType = value;
    }

    public get direction(): number {
        return this._direction;
    }

    public set direction(value: number) {
        this._direction = value;
    }

    public get bodyType(): number {
        return this._bodyType;
    }

    public set bodyType(value: number) {
        this._bodyType = value;
    }
}