/**
 * 头部UI
 */
class HeadUI extends egret.Sprite {
    constructor() {
        super();
        this.initView();
    }

    private playerHead: egret.Bitmap;

    private goldHead: GoldFrame;
    private gasHead: GoldFrame;
    private vedioHead: GoldFrame;


    private initView() {
        this.goldHead = new GoldFrame("gold");
        this.goldHead.x = 70;
        this.goldHead.y = - 150;
        this.addChild(this.goldHead);

        this.gasHead = new GoldFrame("gas");
        this.gasHead.x = 260;
        this.gasHead.y = -150;
        this.gasHead.touchEnabled = true;
        this.gasHead.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        this.addChild(this.gasHead);


        // this.vedioHead = new GoldFrame("bullet");
        // this.vedioHead.x = 80;
        // this.vedioHead.y = 100;
        // this.vedioHead.touchEnabled = true;
        // this.vedioHead.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        // this.addChild(this.vedioHead);

        // this.vedioHead = new GoldFrame("boom");
        // this.vedioHead.x = 280;
        // this.vedioHead.y = 100;
        // this.vedioHead.touchEnabled = true;
        // this.vedioHead.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
        // this.addChild(this.vedioHead);
        // this.inEffect();
    }

    inEffect() {
        egret.Tween.get(this.goldHead).to({ y: 32 + AdaptSceenUtil.y_fix() / 2 }, 400);
        egret.Tween.get(this.gasHead).to({ y: 32 + AdaptSceenUtil.y_fix() / 2 }, 400);
    }

    outEffect() {
        egret.Tween.get(this.goldHead).to({ y: -150 }, 400);
        egret.Tween.get(this.gasHead).to({ y: -150 }, 400);
    }

    public onTouch() {
        EconomicsController.getInstance().addGasFull();
    }

    public get GoldHead() {
        return this.goldHead;
    }
    public get GasHead() {
        return this.gasHead;
    }

    public setGold(value) {
        this.goldHead.amount = value;
    }

    public setGas(value) {
        this.gasHead.amount = value;
    }

    public setGasMax() {
        this.gasHead.updateMax();
    }
}