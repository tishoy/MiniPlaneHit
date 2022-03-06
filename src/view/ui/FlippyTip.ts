/**
 * 
 */
class FlippyTip extends egret.Sprite {
    private contentText: string;

    constructor(text) {
        super();
        this.contentText = text;
        this.initView();
    }

    private initView() {
        let bg = new egret.Bitmap();
        bg.texture = RES.getRes("tip_bg_png");
        bg.anchorOffsetX = bg.width / 2;
        bg.anchorOffsetY = bg.height / 2;
        this.addChild(bg);

        let tipView = DrawUtil.textFilter(this.contentText);
        // tipView.anchorOffsetX = tipView.width / 2;
        // tipView.anchorOffsetY = tipView.height / 2;
        // tipView.x = this.width / 2;
        // tipView.y = this.height / 2;
        this.addChild(tipView)
    }

}