/**
 * 
 */
class GuideView extends egret.Sprite {

    private guide_container: egret.Sprite;
    private bg: egret.Bitmap;
    private guide_step: egret.Bitmap;
    private guide_text: egret.TextField;
    private bullet: BulletView;
    private board: egret.Bitmap;
    private _step: number = 0;
    private backMask: egret.Shape;

    private guide_type: number;

    constructor() {
        super();
        this.initView();
    }

    private initView() {

        this.guide_container = new egret.Sprite();


        this.backMask = new egret.Shape();
        this.backMask.graphics.beginFill(0x000000, 1);
        this.backMask.graphics.drawRect(0, 0, AdaptSceenUtil.curWidth(), AdaptSceenUtil.curHeight());
        this.backMask.graphics.endFill();
        this.backMask.alpha = 0.1;
        this.backMask.touchEnabled = true;
        this.addChild(this.backMask);



        // this.bg = new egret.Bitmap();
        // // this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextStep, this);
        // this.bg.texture = RES.getRes("guide_bg_png");
        // this.bg.width = AdaptSceenUtil.curWidth();
        // this.bg.height = AdaptSceenUtil.curHeight();
        // this.bg.x = 0;

        this.board = new egret.Bitmap();
        // this.board.anchorOffsetX= this.board.width/2;
        // this.board.x = AdaptSceenUtil.curWidth()/2;
        this.board.texture = RES.getRes("guide_board_png");

        // this.bg.anchorOffsetX = this.bg.width / 2;
        // this.bg.anchorOffsetY = this.bg.height / 2;
        // this.bg.x = AdaptSceenUtil.curWidth() / 2;
        // this.bg.y = AdaptSceenUtil.curHeight() / 2;
        this.guide_container.addChild(this.board);

        this.bullet = new BulletView(false);
        this.bullet.type = BulletTypeEnum.MISSILE;
        this.bullet.x = this.board.width + 50;
        this.bullet.y = this.board.height - this.bullet.height;
        this.bullet.scaleX = this.bullet.scaleY = 2;
        this.guide_container.addChild(this.bullet);

        this.guide_step = new egret.Bitmap();
        this.guide_step.y = 0;
        this.guide_container.addChild(this.guide_step);

        this.guide_text = new egret.TextField();
        this.guide_text.width = this.board.width - 60;
        this.guide_text.x = 25;
        this.guide_text.textColor = ColorEnum.PURPLE;
        this.guide_text.height = 120;
        this.guide_text.y = 30;
        this.guide_text.multiline = true;
        this.guide_container.addChild(this.guide_text);

        this.guide_container.anchorOffsetX = this.guide_container.width / 2;
        this.guide_container.anchorOffsetY = this.guide_container.height / 2;
        this.guide_container.x = AdaptSceenUtil.curWidth() / 2;
        this.guide_container.y = AdaptSceenUtil.curHeight() / 2;
        this.addChild(this.guide_container);

        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        // this._step = 1;
        this.touchEnabled = true;
    }

    public setType(type) {
        this.guide_type = type;
        this._step = 0;
        this.setStep();
    }


    public setStep() {
        let data = GuideController.getInstance().getGuideListByType(this.guide_type)[this._step];
        if (data.show == GuideEnum.GUIDE_SHOW_BITMAP) {
            this.guide_step.texture = RES.getRes(data.data);
            this.guide_text.text = "";
        } else {
            this.guide_text.text = data.data;
            this.guide_text.textColor = ArrayUtil.random(ColorEnum.colorList, 1);
            this.guide_step.texture = null;
        }
        switch (data.event) {
            case GuideEnum.TOUCH_EVERY_WHERE:
                this.touchEnabled = true;
                this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextStep, this);
                break;

            case GuideEnum.TOUCH_BUTTON:
                switch (data.id) {
                    case GuideEnum.CITY_TO_PLACE:
                        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guideToPlace, this);
                        break;

                    case GuideEnum.CITY_PLACE_AIRPORT:
                        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guideBuildAirport, this);
                        break;

                    case GuideEnum.CITY_TO_AWAY:
                        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guideToAway, this);
                        break;
                }
                break;

            case GuideEnum.TOUCH_BACK:
                this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.guideBack, this);
                break;

            case GuideEnum.TOUCH_MAP:
                break;
        }
    }

    private guideBack() {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.guideBack, this);
        SceneManager.getInstance().hideGuide();
        SceneManager.getInstance().placingScene.guideBack();
    }

    private guideBuildAirport(e) {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.guideBuildAirport, this);
        SceneManager.getInstance().hideGuide();
        SceneManager.getInstance().placingScene.guideBuildAirport();
    }

    private guideToAway(e) {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.guideToAway, this);
        SceneManager.getInstance().hideGuide();
        SceneManager.getInstance().techScene.guideToAway();
    }

    private guideToPlace(e) {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.guideToPlace, this);
        SceneManager.getInstance().hideGuide();
        SceneManager.getInstance().techScene.guideToPlace();

    }

    public onNextStep(e = null) {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextStep, this);
        this._step++;
        if (GuideController.getInstance().nextGuide(this.guide_type, this._step)) {
            this.setStep();
            GuideController.getInstance().saveGuide(this.guide_type, this._step);
        } else {
            //结束
            SceneManager.getInstance().techScene.endGuide();
            GuideController.getInstance().saveGuide(this.guide_type, this._step);
            SceneManager.getInstance().hideGuide();
        }
    }
}