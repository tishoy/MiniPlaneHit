class TechPop extends egret.Sprite {
    constructor() {
        super();
        this.initView();
    }

    private investTechButton: E8TextButton;

    private bulletView: BulletView;
    private bulletDetail: egret.Sprite;

    private panelBg: egret.Bitmap;

    private container: egret.Sprite;

    private initView() {


        let mask = new egret.Shape();
        mask.graphics.beginFill(0x000000, 1);
        mask.graphics.drawRect(0, 0, AdaptSceenUtil.curWidth(), AdaptSceenUtil.curHeight());
        mask.graphics.endFill();
        mask.alpha = 0.5;
        mask.touchEnabled = true;
        this.addChild(mask);
        mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closePanel, this);


        // this.panelBg = new egret.Bitmap();
        // this.panelBg.texture = RES.getRes("notice_png");
        // this.panelBg.anchorOffsetX = this.panelBg.width / 2;
        // this.panelBg.anchorOffsetY = this.panelBg.height / 2;
        // this.panelBg.x = AdaptSceenUtil.curWidth() / 2;
        // this.panelBg.y = AdaptSceenUtil.curHeight() / 2;
        // this.addChild(this.panelBg);

        this.bulletView = new BulletView(true, false);
        this.bulletView.type = BulletTypeEnum.MISSILE;
        this.bulletView.scaleX = this.bulletView.scaleY = 4;
        this.bulletView.x = AdaptSceenUtil.curWidth() / 2;
        this.bulletView.y = AdaptSceenUtil.y_fix() + 300;// - AdaptSceenUtil.y_fix() - this.bulletView.height / 2;
        this.addChild(this.bulletView);

        this.bulletDetail = DrawUtil.textFilter(i18n.getLanguage(i18n.UI_BULLET_DETAIL_ + BulletTypeEnum.MISSILE), 32, false);
        this.bulletDetail.x = AdaptSceenUtil.curWidth() / 2;
        this.bulletDetail.y = this.bulletView.y + this.bulletView.height / 2 + 275;
        this.addChild(this.bulletDetail);

        this.scrollView = new egret.ScrollView();
        this.bulletContainer = new egret.Sprite();

        this.bulletPool = new Array<BulletView>();

        // this.bulletContainer.removeChildren();

        // this.scrollView.x = 0;
        // this.scrollView.width = AdaptSceenUtil.curWidth();
        // this.scrollView.y = AdaptSceenUtil.y_fix() + 900;
        // this.scrollView.height = 300;
        // this.scrollView.bounces = false;
        // this.scrollView.touchEnabled = true;
        // this.scrollView.setContent(this.bulletContainer);
        // this.addChild(this.scrollView);

        let bullet: BulletView;
        for (let i = 0; i < BulletTypeEnum.COUNT; i++) {

            bullet = new BulletView(true, false, true);
            bullet.type = i;
            bullet.x = 100 + ((AdaptSceenUtil.curWidth() - 200) / 4) / 2 + ((AdaptSceenUtil.curWidth() - 200) / 4) * (i % 4);
            bullet.y = AdaptSceenUtil.y_fix() + 800 + Math.floor(i / 4) * 130;
            bullet.used = false;
            this.bulletPool.push(bullet);
            this.addChild(bullet);
            if (bullet.type == BulletTypeEnum.MISSILE) {
                bullet.used = true;
                this.currentSelected = bullet.type;
                bullet.status = true;
            }
            if (platform.name == "tt" && i == BulletTypeEnum.ARMOR_PIERCING_MISSILE) {
                bullet.visible = false;
            }
            bullet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bulletTouched, this);
        }
        // this.bulletContainer.width += 200;

        let invesTip = DrawUtil.textFilter(i18n.getLanguage(i18n.INVEST_HELP_ + 2), 16);
        invesTip.x = AdaptSceenUtil.curWidth() / 2;
        invesTip.y = 1020 + AdaptSceenUtil.y_fix();
        this.addChild(invesTip);

        this.investTechButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.investTechTouched);
        this.investTechButton.scale(0.65, 0.4);
        this.investTechButton.setButtonText(i18n.getLanguage(i18n.INVEST_BUTTON));
        this.investTechButton.touchEnabled = true;
        this.investTechButton.x = AdaptSceenUtil.curWidth() * 1 / 2;
        this.investTechButton.y = 1080 + AdaptSceenUtil.y_fix()
        this.investTechButton.visible = true;
        this.addChild(this.investTechButton);

        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        this.visible = false;
    }

    private bulletTouched(e) {
        SoundManager.getInstance().playSound(SoundEnum.DROP_M4A);
        let bullet = e.target as BulletView;
        (this.bulletPool[this.currentSelected] as BulletView).used = false;
        this.currentSelected = bullet.type;
        bullet.used = true;
        if (this.contains(this.bulletDetail)) {
            this.removeChild(this.bulletDetail);
        }
        this.bulletView.type = bullet.type;
        this.bulletDetail = DrawUtil.textFilter(i18n.getLanguage(i18n.UI_BULLET_DETAIL_ + bullet.type), 32, false);
        this.bulletDetail.x = AdaptSceenUtil.curWidth() / 2;
        this.bulletDetail.y = this.bulletView.y + this.bulletView.height / 2 + 275;
        this.addChild(this.bulletDetail);
    }

    private bulletPool = [];
    private scrollView: egret.ScrollView;
    private bulletContainer: egret.Sprite;
    private currentSelected: number = 0;

    private closePanel() {
        this.outAnimate();
    }

    inAnimate() {
        this.visible = true;
    }

    outAnimate() {
        this.visible = false;
    }

    investTechTouched() {
        EconomicsController.getInstance().investTech();
    }
}