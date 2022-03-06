/**
 * E8Button类
 */
class E8TextButton extends E8Button {


    constructor(context: any, texture: egret.Texture, backFun: Function = null) {
        super(context, texture, backFun);
        this.effect = new egret.Sprite();
        this.video_icon = new egret.Bitmap();
    }

    public scale(scaleX, scaleY) {
        // let rect = new egret.Rectangle(30, 51, 150, 105);
        // this.btnImg.scale9Grid = rect;
        this.btnImg.width = this.btnImg.width * scaleX;
        this.btnImg.height = this.btnImg.height * scaleY;
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
    }

    private effect: egret.Sprite;
    private effect2;
    private video_icon: egret.Bitmap;

    public setButtonText(textContent, fixX = 0, fixY = 0, texture: string = ""): void {
        if (texture !== "") {
            this.video_icon.texture = RES.getRes(texture);
            this.video_icon.x = 0;
            this.video_icon.y = this.height / 2 - this.video_icon.height / 2 - 2;
            this.addChild(this.video_icon);
        } else {
            if (this.contains(this.video_icon)) {
                this.removeChild(this.video_icon)
            }
        }
        if (textContent.indexOf("\n") != -1) {
            let textS = textContent.split("\n")
            if (this.contains(this.effect)) {
                this.removeChild(this.effect);
            }
            let effect = DrawUtil.textFilter(textS[0], 18, false);
            // effect.anchorOffsetX = effect.width / 2;
            // effect.anchorOffsetY = effect.height / 2;
            effect.x = this.width / 2 + fixX;
            effect.y = this.height / 2 + fixY;
            this.addChild(effect);
            if (this.contains(this.effect2)) {
                this.removeChild(this.effect2);
            }
            this.effect2 = DrawUtil.textFilter(textS[1], 18, false);
            // effect.anchorOffsetX = effect.width / 2;
            // effect.anchorOffsetY = effect.height / 2;
            this.effect2.x = this.width / 2 + fixX;
            this.effect2.y = this.height / 2 + fixY + effect.height * 3 / 4 + 6;
            this.addChild(this.effect2);
        } else {
            if (this.contains(this.effect)) {
                this.removeChild(this.effect);
            }
            if (textContent == "") {
                return;
            }
            this.effect = DrawUtil.textFilter(textContent, 18, false);
            // effect.anchorOffsetX = effect.width / 2;
            // effect.anchorOffsetY = effect.height / 2;
            this.effect.x = this.width / 2 + fixX;
            this.effect.y = this.height / 2 + fixY;
            this.addChild(this.effect);
        }
    }

    public setButtonEnable(texture, backFun) {
        this.changeTexture(texture);
        this.backFun = backFun;
    }
}
