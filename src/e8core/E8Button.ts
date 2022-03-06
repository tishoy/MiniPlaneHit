/**
 * E8Button类
 */
class E8Button extends egret.DisplayObjectContainer {
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
        this.btnImg.touchEnabled = true;
        this.addChild(this.btnImg);

        this.btnImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);

        this.anchorOffsetX = this.btnImg.width / 2;
        this.anchorOffsetY = this.btnImg.height / 2;
    }

    public changeTexture(texture: egret.Texture) {
        this.btnImg.texture = texture;
    }

    public changeCallBack(backFun) {
        this.backFun = backFun;
    }

    private onTouchTap(e): void {
        this.cartoonType = 1;
        this.touchEnabled = false;
        SoundManager.getInstance().playSound(SoundEnum.BTNTOUCH_MP3);
        if (this.isPlayCartoon) {
            return;
        }

        this.btnImg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        this.isPlayCartoon = true;
        var onComplete2: Function = function () {
            this.isPlayCartoon = false;
            this.touchEnabled = true;
        };
        var onComplete1: Function = function () {
            if (this.cartoonType == 1) {
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, x: this.x, y: this.y }, 500, egret.Ease.elasticOut).call(onComplete2, this);
            } else if (this.cartoonType == 2) {
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, x: this.x, y: this.y }, 500, egret.Ease.backOut).call(onComplete2, this);
            } else if (this.cartoonType == 3) {
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1, x: this.x, y: this.y }, 100).call(onComplete2, this);
            }
        };
        egret.Tween.get(this).to({ scaleX: 0.5, scaleY: 0.5, x: this.x, y: this.y }, 100, egret.Ease.sineIn).call(onComplete1, this);
        egret.setTimeout(function () {
            if (this.backFun != null) {
                this.btnImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
                this.backFun.apply(this.param.context, [this.param.data]);
            }
        }, this, 300);
    }

}
