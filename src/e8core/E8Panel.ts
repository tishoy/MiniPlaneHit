/**
 * E8Button类
 */
class E8Panel extends egret.DisplayObjectContainer {
    protected btnImg: egret.Bitmap;
    protected backFun: Function;
    private param = { context: null, data: null };//回调参数
    private isPlayCartoon: boolean = false;
    private cartoonType: number;

    constructor(context: any, texture: egret.Texture, backFun: Function = null) {
        super();
        this.param.context = context;
        this.backFun = backFun;
        this.btnImg = new egret.Bitmap();

        this.btnImg.texture = texture;
        this.btnImg.anchorOffsetX = this.btnImg.width / 2;
        this.btnImg.anchorOffsetY = this.btnImg.height / 2;
        let rect = new egret.Rectangle(30, 51, 150, 105);
        this.btnImg.scale9Grid = rect;
        this.btnImg.scaleX = 4;
        this.btnImg.scaleY = 5;
        this.btnImg.touchEnabled = true;
        this.addChild(this.btnImg);

        // this.btnImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
    }

    public changeTexture(texture: egret.Texture) {
        this.btnImg.texture = texture;
    }

    private onTouchTap(e): void {
        this.cartoonType = 1;
        if (this.isPlayCartoon) {
            return;
        }

        this.btnImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.isPlayCartoon = true;
        var onComplete2: Function = function () {
            this.isPlayCartoon = false;
        };
        var onComplete1: Function = function () {
            if (this.cartoonType == 1) {
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, x: this.x - this.btnImg.width / 4, y: this.y - this.btnImg.height / 4 }, 500, egret.Ease.elasticOut).call(onComplete2, this);
            } else if (this.cartoonType == 2) {
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, x: this.x - this.btnImg.width / 4, y: this.y - this.btnImg.height / 4 }, 500, egret.Ease.backOut).call(onComplete2, this);
            } else if (this.cartoonType == 3) {
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, x: this.x - this.btnImg.width / 4, y: this.y - this.btnImg.height / 4 }, 100).call(onComplete2, this);
            }
        };
        egret.Tween.get(this).to({ scaleX: 0.5, scaleY: 0.5, x: this.x + this.btnImg.width / 4, y: this.y + this.btnImg.height / 4 }, 100, egret.Ease.sineIn).call(onComplete1, this);
        egret.setTimeout(function () {
            if (this.backFun != null) {
                this.btnImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
                this.backFun.apply(this.param.context, [this.param.data]);
            }
        }, this, 300);
    }

}
