/**
 * 用户数据 
 */
class UserData {
    private _gold = 0;
    private _gas = 0;
    private _gasMax = 1;
    private _gasTax = 10;
    private _stockTax = 10;
    private _stocks = [];
    private _defenseMaps = 1;   // 拥有防守地图
    private _historyMaps = 10;
    private _banner = false;
    private _interstitial = false;
    private _guide = 0;
    private _lastDate: number;
    private _registDate: number;
    private _missles = [0];
    private _invest = [0, 0, 0, 0];
    private _loan = { money: 0, time: 0, day: 0 };
    /** 
     *  [{
     *      id:1,
     *      airport:2,
     *      bank:3,
     *      gas_station:5,
     *      science:4,
     *      scenery:1
     * }
     * ]
     */
    // private _buildings = [{ "id": 0, "level": 1, "top": 0, "insure": [] },
    // { "id": 1, "level": 1, "top": 0, "insure": [] },
    // { "id": 2, "level": 1, "top": 0, "insure": [] },
    // { "id": 3, "level": 1, "top": 0, "insure": [] },
    // { "id": 4, "level": 1, "top": 0, "insure": [] },
    // { "id": 5, "level": 1, "top": 0, "insure": [] },
    // { "id": 6, "level": 1, "top": 0, "insure": [] }];

    private videoTimes = 0;


    constructor() {
    }

    public initData() {
        let saveDataString = SaveDataManager.getInstance().getFromLocal("userData") as string;
        let config = Const.getInstance()
        if (saveDataString === null || saveDataString === undefined || saveDataString === "") {
            this._gold = config.initGold;
            this._gas = config.initGas;
            this._gasMax = config.initGasMax;
            this._gasTax = config.initGasTax;
            this._stockTax = config.initStockTax;
            this._stocks = [];
            this._defenseMaps = config.initDefenseMaps;
            this._historyMaps = config.initHistoryMaps;
            this._banner = false;
            this._interstitial = false;
            this._invest = [0, 0, 0, 0];
            this._lastDate = new Date().getTime();
            this._registDate = new Date().getTime();
            this._missles = [0];
            this._guide = config.guideData;
            this._loan = { money: 0, time: 0, day: 0 };
            // let buildings = Const.getInstance().initBuilings;
            // this._buildings = [];
            // for (let i = 0; i < buildings.length; i++) {
            //     let level = Const.getInstance().initLevel[i];
            //     this.buildings.push({ "id": buildings[i], "level": level, "top": level, "insure": [] })
            // }
            // for (let i = 0; i < Const.getInstance().maxBuilding - buildings.length; i++) {
            //     this._buildings.push({ "id": -1, "level": 0, "top": 0, "insure": [] })
            // }
            SaveDataManager.getInstance().saveToLocal("userData",
                JSON.stringify({
                    "gold": this._gold,
                    "gas": this._gas,
                    "gasMax": this._gasMax,
                    "gasTax": this._gasTax,
                    "stockTax": this.stockTax,
                    "stocks": this._stocks,
                    "defenseMaps": this._defenseMaps,
                    "historyMaps": this._historyMaps,
                    "banner": this._banner,
                    "interstitial": this._interstitial,
                    "missles": this._missles,
                    "guide": this._guide,
                    "invest": this._invest,
                    "lastDate": new Date().getTime(),
                    "loan": this._loan
                }));
        } else {
            let saveData = JSON.parse(saveDataString);
            this._gold = saveData["gold"];
            this._gas = saveData["gas"];
            this._gasMax = saveData["gasMax"] == undefined ? config.initGasMax : saveData["gasMax"];
            this._gasTax = saveData["gasTax"] == undefined ? config.initGasTax : saveData["gasMax"];
            this._stockTax = saveData["stockTax"] == undefined ? config.initGasMax : saveData["stockTax"];
            this._stocks = saveData["stocks"] == undefined ? [] : saveData["stocks"];
            this._defenseMaps = saveData["defenseMaps"] == undefined ? config.initDefenseMaps : saveData["defenseMaps"];
            this._historyMaps = saveData["historyMaps"] == undefined ? config.initHistoryMaps : saveData["historyMaps"];
            this._banner = saveData["banner"] == undefined ? false : saveData["banner"];
            this._interstitial = saveData["interstitial"] == undefined ? false : saveData["interstitial"];
            this._invest = saveData["invest"] == undefined ? [0, 0, 0, 0] : saveData["invest"];
            this._registDate = saveData["registDate"] == undefined ? new Date().getTime() : saveData["registDate"];
            this._missles = saveData["missles"] == undefined ? [0] : saveData["missles"];
            this._guide = saveData["guide"];
            this._loan = saveData['loan'] == undefined ? { money: 0, time: 0, day: 0 } : saveData['loan'];
            EconomicsController.getInstance().login(saveData); //lastDate = saveData["lastDate"] == undefined ? new Date().getTime() : saveData["lastDate"]
            this._lastDate = new Date().getTime();
        }
    }

    public set gold(value) {
        this._gold = Math.max(Math.ceil(value), 0);
        this.saveUserData();
    }

    public get gold() {
        return this._gold;
    }

    public set gas(value) {
        this._gas = Math.max(Math.ceil(value), 0);
        this.saveUserData();
    }

    public get gas() {
        return this._gas;
    }

    public set gasMax(value) {
        this._gasMax = value;
        this.saveUserData();
    }

    public get gasMax() {
        return this._gasMax;
    }

    public set gasTax(value) {
        this._gasTax = value;
        this.saveUserData();
    }

    public get gasTax() {
        return this._gasTax;
    }

    public set stockTax(value) {
        this._stockTax = value;
        this.saveUserData();
    }

    public get stockTax() {
        return this._stockTax;
    }

    public updateStock(id, data) {
        let result = false;
        let saved = {
            id: data.id,
            cost: data.cost,
            time: data.time,
            hand: data.hand,
            burst: data.burst
        }
        for (let i = 0; i < this._stocks.length; i++) {
            if (this._stocks[i].id == id) {
                this._stocks[i] = saved;
                result = true;
                break;
            }
        }
        if (result == false) {
            this._stocks.push(saved);
        }
        this.saveUserData();
    }

    public getStockEarn() {
        let money = 0;
        for (let i = 0; i < this._stocks.length; i++) {
            money += this._stocks[i].cost;
        }
        return money;
    }

    public getStockById(id) {
        for (let i = 0; i < this._stocks.length; i++) {
            if (this._stocks[i].id == id) {
                return this._stocks[i];
            }
        }
        return null;
    }

    public get defenseMaps() {
        return this._defenseMaps;
    }

    public set defenseMaps(value) {
        this._defenseMaps = value;
        this.saveUserData();
    }


    public get historyMaps() {
        return this._historyMaps;
    }

    public set historyMaps(value) {
        this._historyMaps = value;
        this.saveUserData();
    }


    public get banner() {
        return this._banner;
    }

    public set banner(value) {
        this._banner = value;
        this.saveUserData();
    }

    public get interstitial() {
        return this._interstitial;
    }

    public set interstitial(value) {
        this._interstitial = value;
        this.saveUserData();
    }

    public get guide() {
        return this._guide;
    }

    public set guide(guide) {
        this._guide = guide;
        this.saveUserData();
    }


    public set missles(missles) {
        this._missles = missles;
        this.saveUserData();
    }

    public get missles() {
        return this._missles;
    }

    public saveUserData() {
        SaveDataManager.getInstance().saveToLocal("userData",
            JSON.stringify({
                "gold": this._gold,
                "gas": this._gas,
                "gasMax": this._gasMax,
                "gasTax": this._gasTax,
                "stockTax": this.stockTax,
                "stocks": this._stocks,
                "defenseMaps": this._defenseMaps,
                "historyMaps": this._historyMaps,
                "banner": this._banner,
                "interstitial": this._interstitial,
                "missles": this._missles,
                "guide": this._guide,
                "invest": this._invest,
                "lastDate": this._lastDate,
                "registDate": this._registDate,
                "loan": this._loan
            }));
    }


    public getSaveData() {
        return {
            "gold": this._gold,
            "gas": this._gas,
            "gasMax": this._gasMax,
            "gasTax": this._gasTax,
            "stockTax": this.stockTax,
            "stocks": this._stocks,
            "defenseMaps": this._defenseMaps,
            "historyMaps": this._historyMaps,
            "banner": this._banner,
            "interstitial": this._interstitial,
            "missles": this._missles,
            "guide": this._guide,
            "invest": this._invest,
            "lastDate": this._lastDate,
            "registDate": this._registDate,
            "loan": this._loan
        }
    }

    public get lastDate() {
        if (this._lastDate === undefined) {
            this.setLastDate();
        }
        return this._lastDate;
    }

    public get registDate() {
        if (this._registDate === undefined) {
            this._registDate = this._lastDate;
            this.saveUserData();
        }
        return this._registDate;
    }

    public setLastDate() {
        this._lastDate = new Date().getTime();
        this.saveUserData();
    }

    public get loan() {
        return this._loan;
    }

    public set loan(value) {
        this._loan = value;
        this.saveUserData();
    }

    public saveInvest(id, money) {
        if (this._invest.length < 4) {
            this._invest = [0, 0, 0, 0];
        }
        this._invest[id] += money;
        this.saveUserData();
    }

    public get invest() {
        return this._invest;
    }

}