/**
 * 
 */
class Stock extends egret.Sprite {
    constructor() {
        super();
        this.initView();
    }

    private _id: number;
    private stockName: egret.TextField;
    private price: egret.TextField;
    private cost: egret.TextField;
    private hand: egret.TextField;
    private buyButton: E8Button;
    private sellButton: E8Button;
    private _data: StockData;

    private initView() {

        this.stockName = new egret.TextField();
        this.stockName.x = 0;
        this.addChild(this.stockName);

        this.price = new egret.TextField();
        this.price.x = 80;
        this.price.size = 20;
        this.price.textAlign = egret.HorizontalAlign.RIGHT;
        this.addChild(this.price);

        this.cost = new egret.TextField();
        this.cost.x = 170;
        this.cost.size = 20;
        this.cost.textAlign = egret.HorizontalAlign.RIGHT;
        this.addChild(this.cost);

        this.hand = new egret.TextField();
        this.hand.x = 240;
        this.hand.size = 20;
        this.hand.width = 180;
        this.hand.textAlign = egret.HorizontalAlign.RIGHT;
        this.addChild(this.hand);

    }

    public setStock(data: StockData) {
        this._data = data;
        this.stockName.text = data.name;
        this.stockName.width = this.stockName.textWidth;
        this.price.text = isNaN(data.price) ? "-" : data.price.toFixed(2);
        this.price.width = this.stockName.textWidth;
        this.cost.text = isNaN(data.cost / data.hand) || data.hand == 0 ? "-" : (data.cost / data.hand).toFixed(2);
        this.cost.width = this.stockName.textWidth;
        this.hand.text = data.hand.toString();
        // this.hand.width = this.stockName.textWidth;
        if (!EconomicsController.getInstance().stockClosed()) {
            if (data.hand > 0) {
                if (data.cost / data.hand > data.price) {
                    this.price.textColor = ColorEnum.GREEN;
                    this.cost.textColor = ColorEnum.GREEN;
                    this.stockName.textColor = ColorEnum.GREEN;
                    this.hand.textColor = ColorEnum.GREEN;
                } else {
                    this.price.textColor = ColorEnum.REDMAX;
                    this.cost.textColor = ColorEnum.REDMAX;
                    this.stockName.textColor = ColorEnum.REDMAX;
                    this.hand.textColor = ColorEnum.REDMAX;
                }
            }
        }

        // this.anchorOffsetX = this.width / 2;
        // this.anchorOffsetY = this.height / 2;
    }

    public updateCostHand() {
        let data = EconomicsController.getInstance().stocks[this._id];
        this.hand.text = data.hand;
        this.cost.text = isNaN(data.cost / data.hand) || data.hand == 0 ? "-" : (data.cost / data.hand).toFixed(2);
        if (!EconomicsController.getInstance().stockClosed()) {
            if (data.hand > 0) {
                if (data.cost / data.hand > data.price) {
                    this.price.textColor = ColorEnum.GREEN;
                    this.cost.textColor = ColorEnum.GREEN;
                    this.stockName.textColor = ColorEnum.GREEN;
                    this.hand.textColor = ColorEnum.GREEN;
                } else {
                    this.price.textColor = ColorEnum.REDMAX;
                    this.cost.textColor = ColorEnum.REDMAX;
                    this.stockName.textColor = ColorEnum.REDMAX;
                    this.hand.textColor = ColorEnum.REDMAX;
                }
            } else {
                this.price.textColor = ColorEnum.WHITE;
                this.cost.textColor = ColorEnum.WHITE;
                this.stockName.textColor = ColorEnum.WHITE;
                this.hand.textColor = ColorEnum.WHITE;
            }
        }
    }

    public get id() {
        return this._id;
    }

    public set id(id) {
        this._id = id;
    }

    public get data() {
        return this._data;
    }
}