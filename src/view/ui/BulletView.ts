/**
 * 
 * 
 */
class BulletView extends egret.Sprite {
    private _used = false;
    private _type = BulletTypeEnum.MISSILE;
    private view: egret.Bitmap;
    private _index: number = 0;
    private selectedFrame: egret.Bitmap;
    private bg: egret.Bitmap;
    private typeTextField: egret.Sprite;
    private _status: boolean = false;
    private goldFrame: GoldFrame;

    private showName = false;
    private showCost = false;
    private withBg = false;

    constructor(showName = true, showCost = false, withBg = false) {
        super();
        this.showName = showName;
        this.showCost = showCost;
        this.withBg = withBg;
        this.initView();
    }


    private initView() {


        this.view = new egret.Bitmap();
        this.addChild(this.view);

        this.bg = new egret.Bitmap();
        this.goldFrame = new GoldFrame(ResourceEnum.GOLD, false);

        // if (this.showName) {
        //     // if (this._type === BulletTypeEnum.GUIDED_MISSILE) {
        //     //     this.typeTextField = DrawUtil.textFilter(i18n.getLanguage("ui_bullet_" + this._type) + "\n(" + i18n.getLanguage("ui_bullet_no_index") + ")");
        //     // } else {
        //     this.typeTextField = DrawUtil.textFilter(i18n.getLanguage("ui_bullet_" + this._type) + this._index.toString());
        //     // }
        //     this.addChild(this.typeTextField);
        //     this.view.y = this.typeTextField.height;
        // }
    }

    private reinitView() {
        if (this.showName) {
            // if (this._type === BulletTypeEnum.GUIDED_MISSILE) {
            //     this.typeTextField = DrawUtil.textFilter(i18n.getLanguage("ui_bullet_" + this._type) + "\n(" + i18n.getLanguage("ui_bullet_no_index") + ")");
            // } else {
            if (this.contains(this.typeTextField)) {
                this.removeChild(this.typeTextField);
            }
            this.typeTextField = DrawUtil.textFilter(i18n.getLanguage("ui_bullet_" + this._type), 18);
            this.typeTextField.y = this.view.y + this.view.height / 3;
            this.addChild(this.typeTextField);
        }

        if (this.withBg) {
            this.bg.texture = RES.getRes("map_bg_png");
            this.bg.anchorOffsetX = this.bg.width / 2;
            this.bg.anchorOffsetY = this.bg.height / 2;
            this.bg.scaleX = this.bg.scaleY = 0.8;
            this.bg.x = this.view.x;
            this.bg.y = this.view.y + 20;
            this.addChildAt(this.bg, 0);
            this.touchEnabled = true;
        }

        if (this.showCost) {
            this.goldFrame.amount = BulletDataCache.getInstance().getData(this.type).cost;
            this.goldFrame.anchorOffsetX = this.goldFrame.width / 2;
            this.goldFrame.anchorOffsetY = this.goldFrame.height / 2;
            this.goldFrame.scaleX = 0.8;
            this.goldFrame.scaleY = 0.8;
            this.goldFrame.x = 10;
            this.goldFrame.y = this.view.y - this.view.height / 3;
            this.addChild(this.goldFrame);

            // this.goldIcon.y = this.view.y + this.view.height;
            // this.costTextField.y = this.view.y + this.view.height;
            if (this.withBg) {
                this.typeTextField.x = this.bg.x;
            }
            this.typeTextField.y = this.view.y + this.view.height / 3;

            this.touchEnabled = true;

        }

    }

    public updateView() {
        if (!this._status) {
            DrawUtil.setImageColor(this.view, ColorEnum.GRAY);
        } else {
            DrawUtil.setImageColor(this.view, ColorEnum.WHITE);
        }
    }

    public set index(index) {
        this._index = index;
        // if (this._index > 20) {
        //     this.visible = false;
        // }
        // this.updateView();
    }

    public set type(type) {
        this._type = type;
        this.view.texture = RES.getRes("bullet" + type);
        this.view.anchorOffsetX = this.view.width / 2;
        this.view.anchorOffsetY = this.view.height / 2;
        this.view.scaleX = this.view.scaleY = 0.5;
        this.reinitView();
    }

    public get type() {
        return this._type;
    }

    public set status(value) {
        this._status = value;
        this.updateView();
    }

    public set used(value) {
        if (value) {
            this.scaleX = this.scaleY = 0.75;
            this.bg.texture = RES.getRes("map_bg_selected_png");
        } else {
            this.scaleX = this.scaleY = 0.7;
            this.bg.texture = RES.getRes("map_bg_png");
        }
        this._used = value;
    }

    public get used() {
        return this._used;
    }

}