/**
 * 
 */
class Const {

    public static GRID_WIDTH = 60;
    private static instance = null;
    private _data;

    constructor() {
        this.intiData();
    }

    public static getInstance(): Const {
        if (this.instance === null) {
            this.instance = new Const();
        }
        return this.instance;
    }

    private intiData() {
        this._data = RES.getRes("const_json");
    }

    public get maxBuilding() {
        return this._data["maxBuilding"];
    }

    public get unlockData() {
        return this._data["unlockData"];
    }

    public get initBuilings() {
        return this._data["initBuilings"];
    }


    public get initLevel() {
        return this._data["initLevel"];
    }


    public get initGold() {
        return this._data["initGold"];
    }


    public get initGasMax() {
        return this._data["initGasMax"];
    }


    public get initGas() {
        return this._data["initGas"];
    }

    public get initGasTax() {
        return this._data["initGasTax"];
    }

    public get gasTaxMin() {
        return this._data["gasTaxMin"];
    }

    public get initStockTax() {
        return this._data["initStockTax"];
    }

    public get stockTaxMin() {
        return this._data["stockTaxMin"];
    }

    public get initDefenseMaps() {
        return this._data["initDefenseMaps"];
    }

    public get initHistoryMaps() {
        return this._data["initHistoryMaps"];
    }

    public get guideData() {
        return this._data["guideData"];
    }

    public get winBullets() {
        return this._data["winBullets"];
    }

    public get baseHitReward() {
        return this._data["baseHitReward"];
    }

    public get player() {
        return this._data["player"]
    }

    public get clientVersion() {
        return this._data["clientVersion"];
    }

}