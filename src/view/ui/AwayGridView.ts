/**
 * 
 */
class AwayGridView extends GridView {

    private _status;

    // private coverSprite: egret.Sprite;
    // private cloud_cover: egret.Bitmap;
    // private middle_cover: egret.Bitmap;
    // private shadow_cover: egret.Bitmap;

    private bullet: BulletView;

    private _enable: number = 0;
    private _signType: number;
    private _effect: boolean;
    private _fire: boolean;
    private effectView: egret.Bitmap;
    private fireView: egret.Bitmap;

    constructor(id) {
        super(id);
        super.initView();

        // this.coverSprite = new egret.Sprite();
        // this.addChild(this.coverSprite);


        // this.shadow_cover = new egret.Bitmap();
        // // this.shadow_cover.texture = RES.getRes("shadow_cover");
        // this.shadow_cover.x = -8;
        // this.shadow_cover.y = -8;
        // this.addChildAt(this.shadow_cover, this.getChildIndex(this.gridView));


        // this.middle_cover = new egret.Bitmap();
        // // this.middle_cover.texture = RES.getRes("middle_cover");
        // this.middle_cover.x = -8;
        // this.middle_cover.y = -8;
        // // this.coverSprite.addChild(this.middle_cover);


        // this.cloud_cover = new egret.Bitmap();
        // this.cloud_cover.texture = RES.getRes("cloud_cover");
        // this.cloud_cover.x = -8;
        // this.cloud_cover.y = -8;
        // // this.coverSprite.addChild(this.cloud_cover);


        this.effectView = new egret.Bitmap();
        this.effectView.anchorOffsetX = this.effectView.width / 2;
        this.effectView.anchorOffsetY = this.effectView.height / 2;
        // this.effectView.x = this.width / 2;
        // this.effectView.y = this.height / 2;
        this.addChild(this.effectView);

        this.fireView = new egret.Bitmap();
        this.fireView.anchorOffsetX = this.fireView.width / 2;
        this.fireView.anchorOffsetY = this.fireView.height / 2;
        this.addChild(this.fireView);

        this.status = GridStatusEnum.COVER;
    }

    public updateView() {

        if (this._touched) {

        }
        if (this._status === GridStatusEnum.COVER) {
            // this.coverSprite.visible = true;
            // this.shadow_cover.visible = true;
            this.gridView.texture = RES.getRes("cover");
            this.gridView.alpha = 1;
        } else if (this._status === GridStatusEnum.KNOWN) {
            if (this.type === GridTypeEnum.HEAD) {
                this.gridView.texture = RES.getRes("head");
                this.gridView.alpha = 1;
            } else if (this.type === GridTypeEnum.BODY) {
                this.gridView.texture = RES.getRes("body");
                this.gridView.alpha = 1;
            } else if (this.type === GridTypeEnum.MISS) {
                this.gridView.texture = RES.getRes("miss");
                this.gridView.alpha = 1;
            }
        } else if (this._status === GridStatusEnum.SHOW) {
            if (this.type === GridTypeEnum.HEAD) {
                this.gridView.texture = RES.getRes("head");
                this.gridView.alpha = 1;
            } else if (this.type === GridTypeEnum.BODY) {
                this.gridView.texture = RES.getRes("body");
                this.gridView.alpha = 1;
            } else if (this.type === GridTypeEnum.MISS) {
                this.gridView.texture = RES.getRes("miss");
                this.gridView.alpha = 1;
            } else if (this.type === GridTypeEnum.UNSET) {
                this.gridView.texture = RES.getRes("cover");
                this.gridView.alpha = 1;
            }
            return;


        } else if (this._status === GridStatusEnum.UNSHOW) {

        }

    }

    public hitEffect() {
        egret.Tween.get(this.gridView).to({
            scaleX: 1.1, scaleY: 1.1
        }, 200).to({
            scaleX: 1, scaleY: 1
        }, 300);
    }

    public preparePuzzle(target) {
        if (this._status !== target) {
            this._status = target;

            egret.Tween.get(this.effectView, { loop: false }).call(() => {
                this.effectView.texture = RES.getRes("active");
            }).wait(300).call(() => {
                this.effectView.texture = RES.getRes("active2");
            }).wait(300).call(() => {
                this.effectView.texture = null;
                this.updateView();
            });
        }
        this.fire = false;
    }

    public resetView() {
        if (this._status != GridStatusEnum.COVER) {
            egret.Tween.get(this.effectView, { loop: false }).call(() => {
                this.effectView.texture = RES.getRes("active");
            }).wait(300).call(() => {
                this.effectView.texture = RES.getRes("active2");
            }).wait(300).call(() => {
                this.effectView.texture = null;
                this.updateView();
            });
        }
        this._status = GridStatusEnum.COVER;
        this._type = GridTypeEnum.MISS;
        this.fire = false;
    }

    public set status(value) {
        this._status = value;
        this.updateView();
    }

    public get status(): number {
        return this._status;
    }

    public set signType(value) {
        this._signType = value;
    }

    public get signType() {
        return this._signType;
    }

    public set enable(status) {
        this._enable = status;
        // if (status === 0) {
        //     this.alpha = 1;
        //     DrawUtil.setImageColor(this, 0xffffff);
        // } else if (status === 1) {
        //     this.alpha = 0.2;
        //     DrawUtil.setImageColor(this, 0x444444);
        // } else if (status === 2) {
        //     this.alpha = 0.2;
        //     DrawUtil.setImageColor(this, 0xff4444);
        // }

    }


    public get enable() {
        return this._enable;
    }


    public set selected(value) {
        this._selected = value;
        if (this._selected) {
            // this.bullet.type = BulletController.getInstance().getCurrentBullet();
            // this.gridView
            // this.addChild(this.bullet);
        } else {
            // if (this.contains(this.bullet)) {
            //     this.removeChild(this.bullet);
            // }
        }
    }

    public showHelp(type) {

        if (true) {
            egret.Tween.get(this.effectView, { loop: false }).call(() => {
                if (type === GridTypeEnum.HEAD) {
                    this.effectView.texture = RES.getRes("head");
                    this.effectView.alpha = 1;
                } else if (type === GridTypeEnum.BODY) {
                    this.effectView.texture = RES.getRes("body");
                    this.effectView.alpha = 1;
                }
            }).wait(600).call(() => {
                this.effectView.texture = null;
            }).wait(600).call(() => {
                if (type === GridTypeEnum.HEAD) {
                    this.effectView.texture = RES.getRes("head");
                    this.effectView.alpha = 1;
                } else if (type === GridTypeEnum.BODY) {
                    this.effectView.texture = RES.getRes("body");
                    this.effectView.alpha = 1;
                }
            }).wait(600).call(() => {
                this.effectView.texture = null;
            });
        } else {
            this.effectView.texture = null;
            egret.Tween.removeTweens(this.effectView);
        }
    }


    public set effect(value) {
        this._effect = value;
        if (this._effect) {
            egret.Tween.get(this.effectView, { loop: true }).call(() => {
                this.effectView.texture = RES.getRes("active");
            }).wait(600).call(() => {
                this.effectView.texture = RES.getRes("active2");
            }).wait(600);
        } else {
            this.effectView.texture = null;
            egret.Tween.removeTweens(this.effectView);
        }
    }

    public get effect() {
        return this._effect;
    }

    public set fire(value) {
        this._fire = value;
        if (this._fire) {
            this.fireFrame = NumUtil.range(1, 9, true);
            // this.fireView.texture = RES.getRes("fire_" + NumUtil.range(1, 9, true));
            this.addEventListener(egret.Event.ENTER_FRAME, this.firing, this);
        } else {
            this.fireView.texture = null;
            this.removeEventListener(egret.Event.ENTER_FRAME, this.firing, this);
        }
    }

    private fireFrame = 1;

    public firing(e) {
        this.fireFrame++;
        if (this.fireFrame === 9) {
            this.fireFrame = 1;
        }
        this.fireView.texture = RES.getRes("fire_" + this.fireFrame);
    }
}