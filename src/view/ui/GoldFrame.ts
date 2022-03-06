/**
 * 金币显示
 */
class GoldFrame extends egret.Sprite {
    /**
     * 资源类型
     */
    private _type;

    private _amount = 0;

    private goldIcon: egret.Bitmap;
    private frameBg: egret.Bitmap;
    private amountText: egret.TextField;
    private targetNumber: number = 0;
    private dValue: number = 0;

    private scrolling: boolean;

    private addIcon: egret.Bitmap;
    private showAddIcon: boolean;

    private vedioPlayTimesText: egret.TextField;
    private vedioPlayTimes: number;

    constructor(type, showAddIcon = false) {
        super();
        this.showAddIcon = showAddIcon;
        this._type = type;
        this.initView();
    }

    private initView() {
        this.scrolling = false;

        this.addIcon = new egret.Bitmap();
        this.addIcon.texture = RES.getRes("add_icon_png");
        this.addIcon.y = 0;
        this.addIcon.touchEnabled = true;
        this.addIcon.visible = false;
        this.addChild(this.addIcon);

        this.frameBg = new egret.Bitmap;
        this.frameBg.texture = RES.getRes("frame_png");
        this.frameBg.x = 0;
        this.frameBg.y = 0;
        this.addChild(this.frameBg);
        this.addIcon.x = this.frameBg.width - 45;


        this.goldIcon = new egret.Bitmap();
        if (this._type === "gold") {
            this.goldIcon.texture = RES.getRes("gold_png");
            this.goldIcon.scaleX = this.goldIcon.scaleY = 1.5;
        } else if (this._type === "gas") {
            this.goldIcon.texture = RES.getRes("gas_png");
            this.goldIcon.scaleX = this.goldIcon.scaleY = 1.5;
        } else if (this._type.indexOf("bullet") !== -1) {
            this.goldIcon.texture = RES.getRes(this._type);
            this.goldIcon.scaleX = this.goldIcon.scaleY = 0.5;
        } else if (this._type === "boom") {
            this.goldIcon.texture = RES.getRes("bullet7");
            this.goldIcon.scaleX = this.goldIcon.scaleY = 0.5;
        }
        this.goldIcon.x = -10;
        this.goldIcon.y = -20;
        this.addChild(this.goldIcon);

        this.amountText = new egret.TextField();
        this.amountText.text = "0";
        this.amountText.x = this.goldIcon.width - 20;
        this.amountText.textAlign = egret.HorizontalAlign.RIGHT;
        this.amountText.y = 10;
        this.amountText.width = 120;
        this.addChild(this.amountText);


        // if (this._type === "gold") {
        //     this.addIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddGold, this);
        // } else if (this._type === "gas") {
        //     this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAddGas, this);
        // } else if (this._type === "vedio") {
        //     this.addIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onVedioPlay, this);
        // }

        // this.vedioPlayTimesText = new egret.TextField();
        // this.vedioPlayTimesText.x = this.frameBg.x;
        // this.vedioPlayTimesText.y = this.frameBg.height;
        // this.vedioPlayTimesText.text = this.vedioPlayTimes + "/20"
        // this.addChild(this.vedioPlayTimesText);
    }

    private onAddGold(e) {

    }

    private onAddGas(e) {

    }

    private onVedioPlay() {

    }

    // public set type(value) {
    //     this._type = value;
    // }

    public set amount(value) {
        if (isNaN(value)) {
            value = 0;
        }
        if (this.scrolling === false) {
            this.targetNumber = value;
            // this._amount = value;
            // this.updateView();
            this.dValue = this.targetNumber - this._amount;
            this.scrolling = true;
            this.addEventListener(egret.Event.ENTER_FRAME, this.scrollToAmount, this);
        } else {
            // this.targetNumber = value;
            this.targetNumber = value;
            this.updateView();
        }
    }

    public updateMax() {
        this.updateView();
    }

    private scrollToAmount(e) {
        if (this._amount < this.targetNumber && this.scrolling === true) {
            this._amount += this.targetNumber - this._amount > Math.ceil(this.dValue / 30) ? Math.ceil(this.dValue / 30) : this.targetNumber - this._amount;
            this.updateView();
        } else {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.scrollToAmount, this);
            this._amount = this.targetNumber;
            this.scrolling = false;
            this.updateView();
        }
    }

    private updateView() {
        if (this._type === "gold") {
            if (this._amount > 100000) {
                this.amountText.text = NumUtil.numberToString(this._amount);
            } else {
                this.amountText.text = this._amount.toString();
            }
        } else if (this._type === "gas") {
            // let gas_station = 
            // this.amountText.text = "800/800"
            // this.amountText.text = (this._amount < CityController.getInstance().getGasStationMax() ? this._amount : CityController.getInstance().getGasStationMax()) + "/" + CityController.getInstance().getGasStationMax();
            if (this._amount > SaveDataManager.getInstance().getUserData().gasMax) {
                this.amountText.textColor = ColorEnum.RED;
            } else {
                this.amountText.textColor = ColorEnum.WHITE;
            }
            this.amountText.text = this._amount + "/" + SaveDataManager.getInstance().getUserData().gasMax;
            this.addIcon.visible = true;
        } else if (this._type === "watch") {
            // this.vedioPlayTimes = SaveDataManager.getInstance().getUserData().costVedioTimes();
        } else if (this._type === "bullet0") {
            this.amountText.text = this._amount.toString();
        }

    }
}
