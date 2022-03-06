/**
 * 
 */
class StockData {

    private _name: string;
    private _price: number;
    private _cost: number;
    private _hand: number;
    private _time: number;
    private _burst: boolean;
    private _id: number;

    constructor() {
    }

    public set name(value) {
        this._name = value;
    }

    public get name() {
        return this._name;
    }

    public set price(value) {
        this._price = value;
    }

    public get price() {
        return this._price;
    }

    public set cost(value) {
        this._cost = value;
    }

    public get cost() {
        return this._cost;
    }

    public get hand() {
        return this._hand;
    }

    public set hand(value) {
        this._hand = value;
    }

    public set time(value) {
        this._time = value;
    }

    public get time() {
        return this._time;
    }

    public set id(value) {
        this._id = value;
    }

    public get id() {
        return this._id;
    }

    public set burst(value) {
        this._burst = value;
    }

    public get burst() {
        return this._burst;
    }


}