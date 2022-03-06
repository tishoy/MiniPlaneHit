/**
 * 游戏场景
 * 
 * 出征场景
 * create by tishoy
 * 2019.4.20
 */

class AwayScene extends egret.Sprite {
    constructor() {
        super();
        this.initView();
    }

    private gameView: GameView;

    // private messageView: AwayGameMsgView;
    private backButton: E8Button;

    private guide_view: GuideView;
    private q_icon: egret.Bitmap;

    private progress: Progress;

    private shareButton: E8TextButton;
    private robotButton: E8TextButton;
    private giveUpButton: E8TextButton;
    private recordButton: E8TextButton;
    private recordStopButton: E8TextButton;

    private helpGrid: number = -1;

    private videoTip: egret.Sprite;

    // private bullet1: GoldFrame; // 普通炮弹
    // private bullet2: GoldFrame; // 九宫格
    // private bullet3: GoldFrame; // bird

    private initView() {


        // this.bullet1 = new GoldFrame("bullet0");
        // this.bullet1.x = 20;
        // this.bullet1.y = 150;
        // this.bullet1.touchEnabled = true;
        // this.bullet1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBullet1, this);
        // // this.addChild(this.bullet1);

        // this.bullet2 = new GoldFrame("bullet6");
        // this.bullet2.x = 220;
        // this.bullet2.y = 150;
        // this.bullet2.touchEnabled = true;
        // this.bullet2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBullet2, this);
        // // this.addChild(this.bullet2);

        // this.bullet3 = new GoldFrame("bullet7");
        // this.bullet3.x = 420;
        // this.bullet3.y = 150;
        // this.bullet3.touchEnabled = true;
        // this.bullet3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBullet3, this);
        // // this.addChild(this.bullet3);

        this.progress = new Progress();
        this.progress.anchorOffsetX = this.progress.width / 2;
        this.progress.anchorOffsetY = this.progress.height / 2
        this.progress.x = AdaptSceenUtil.curWidth() / 2;
        this.progress.y = 160 + AdaptSceenUtil.y_fix();
        this.addChild(this.progress);

        this.backButton = new E8Button(this, RES.getRes("back_png"), this.onBackButtonTouched);
        this.backButton.touchEnabled = true;
        this.backButton.x = -10 + this.backButton.width / 2;
        this.backButton.y = 32 + AdaptSceenUtil.y_fix() / 2 + this.backButton.height / 2 + platform.offsetHead();
        this.addChild(this.backButton);

        this.q_icon = new egret.Bitmap();
        this.q_icon.texture = RES.getRes("question");
        this.q_icon.x = AdaptSceenUtil.curWidth() - this.q_icon.width - 20;
        this.q_icon.y = AdaptSceenUtil.y_fix() + 100;
        this.addChild(this.q_icon);
        this.q_icon.touchEnabled = true;
        this.q_icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowGuide, this);

        if (GMToolManager.isRelease) {

        }


        // this.guide_view.setType(GuideEnum.GUIDE_TYPE_AWAY);

        // this.targetBullet.anchorOffsetX = this.targetBullet.width / 2;
        // this.targetBullet.anchorOffsetY = this.targetBullet.height / 2;

        this.recordButton = new E8TextButton(this, RES.getRes("btn_green_png"), this.recordButtonTouched);
        this.recordButton.scale(0.65, 0.4);
        this.recordButton.setButtonText("录 制 视 频");
        this.recordButton.touchEnabled = true;
        this.recordButton.x = AdaptSceenUtil.curWidth() * 3 / 6;
        this.recordButton.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.recordButton);

        this.recordStopButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.recordStopButtonTouched);
        this.recordStopButton.scale(0.65, 0.4);
        this.recordStopButton.setButtonText("停 止 录 制");
        this.recordStopButton.touchEnabled = true;
        this.recordStopButton.x = AdaptSceenUtil.curWidth() * 3 / 6;
        this.recordStopButton.y = 1080 + AdaptSceenUtil.y_fix();
        this.recordStopButton.visible = false;
        this.addChild(this.recordStopButton);

        this.robotButton = new E8TextButton(this, RES.getRes("btn_blue_png"), this.robotButtonTouched);
        this.robotButton.scale(0.65, 0.4);
        this.robotButton.setButtonText("看视频提示");
        this.robotButton.touchEnabled = true;
        this.robotButton.x = AdaptSceenUtil.curWidth() * 3 / 6;
        this.robotButton.y = 1080 + AdaptSceenUtil.y_fix();
        // this.addChild(this.robotButton);

        this.giveUpButton = new E8TextButton(this, RES.getRes("btn_red_png"), this.giveUpTouched);
        this.giveUpButton.scale(0.65, 0.4);
        this.giveUpButton.setButtonText("放 弃 返 航");
        this.giveUpButton.touchEnabled = true;
        this.giveUpButton.x = AdaptSceenUtil.curWidth() * 5 / 6;
        this.giveUpButton.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.giveUpButton);

        this.shareButton = new E8TextButton(this, RES.getRes("btn_blue_png"), this.shareButtonTouched);
        this.shareButton.scale(0.65, 0.4);
        this.shareButton.setButtonText("场 外 求 助");
        this.shareButton.touchEnabled = true;
        this.shareButton.x = AdaptSceenUtil.curWidth() / 6;
        this.shareButton.y = 1080 + AdaptSceenUtil.y_fix();
        this.addChild(this.shareButton);

        this.videoTip = DrawUtil.textFilter(i18n.getLanguage(i18n.NOT_ENOUGH_MONEY_TIP), 16);
        this.videoTip.x = AdaptSceenUtil.curWidth() / 2;
        this.videoTip.y = 1035 + AdaptSceenUtil.y_fix();
        this.addChild(this.videoTip);

        this.scrollView = new egret.ScrollView();
        this.bulletContainer = new egret.Sprite();

        this.bulletPool = new Array<BulletView>();

        this.bulletContainer.removeChildren();

        this.scrollView.x = 0;
        this.scrollView.width = AdaptSceenUtil.curWidth();
        this.scrollView.y = AdaptSceenUtil.y_fix() + 880;
        this.scrollView.height = 300;
        this.scrollView.bounces = false;
        this.scrollView.touchEnabled = true;
        this.scrollView.setContent(this.bulletContainer);
        this.addChild(this.scrollView);

        let bullet: BulletView;
        let missles = SaveDataManager.getInstance().getUserData().missles;
        for (let i = 0; i < BulletTypeEnum.COUNT; i++) {
            bullet = new BulletView(true, true, true);
            bullet.type = i;
            bullet.x = 100 + i * 110;
            bullet.y = 70;
            bullet.used = false;
            this.bulletPool.push(bullet);
            this.bulletContainer.addChild(bullet);
            if (bullet.type == BulletTypeEnum.MISSILE) {
                bullet.used = true;
                this.currentSelected = bullet.type;
                BulletController.getInstance().useBullet(bullet.type);
                bullet.status = true;
            } else {
                if (missles.indexOf(bullet.type) !== -1) {

                } else {
                    var colorMatrix = [
                        0.3, 0.6, 0, 0, 0,
                        0.3, 0.6, 0, 0, 0,
                        0.3, 0.6, 0, 0, 0,
                        0, 0, 0, 1, 0
                    ];

                    var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
                    bullet.filters = [colorFlilter];
                }
            }
            bullet.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bulletTouched, this);
        }
        this.bulletContainer.width += 200;
    }

    public ownBirdBullet() {
        let bird = this.bulletPool[BulletTypeEnum.ARMOR_PIERCING_MISSILE];
        if (bird.filters.length > 0) {
            bird.addEventListener(egret.TouchEvent.TOUCH_TAP, this.bulletTouched, this);
            bird.filters = [];
        }
    }

    private bulletTouched(e) {
        let missles = SaveDataManager.getInstance().getUserData().missles;
        let bullet = e.target as BulletView;
        if (missles.indexOf(bullet.type) !== -1) {
            SoundManager.getInstance().playSound(SoundEnum.DROP_M4A);
            (this.bulletPool[this.currentSelected] as BulletView).used = false;
            this.currentSelected = bullet.type;
            bullet.used = true;
            BulletController.getInstance().useBullet(bullet.type);
        } else {
            SceneManager.getInstance().showTip("您需要对科技产业进行研究，才能有更高科技的炮弹")
        }

    }

    private bulletPool = [];
    private scrollView: egret.ScrollView;
    private bulletContainer: egret.Sprite;
    private currentSelected: number = 0;

    private giveUpTouched() {
        SceneManager.getInstance().showAlert("报  告", "    返航将会记录一次败绩，如果临时返回可以点击左上角返回按钮。以便再次进攻！真的要返航么？", "返  航", () => {
            this.giveUpButton.touchEnabled = false;
            GameController.getInstance().gameFinished(false);
            SceneManager.getInstance().hideAlert();
        }, "取消");
    }

    private shareButtonTouched() {
        // platform.share()
        let id = MapUtil.headDataToHeadId(RecordController.getInstance().heads);
        platform.share("这个图我过不去了，快来帮帮弟弟吧", "", "", this.onShared, "mapId=" + id, "");
    }

    private onShared(data) {
        // console.log(data);
        SceneManager.getInstance().showTip("分享成功");
    }

    private recordButtonTouched() {
        console.log("按钮点击")
        this.recordButton.visible = false;
        this.recordStopButton.visible = true;
        if (!GameController.getInstance().record) {
            GameController.getInstance().record = true;
            platform.startRecord();
        }

    }

    private recordStopButtonTouched() {
        this.recordButton.visible = true;
        this.recordStopButton.visible = false;
        if (GameController.getInstance().record) {
            platform.stopRecord();
        }
    }

    private robotButtonTouched() {
        AdvertiseController.getInstance().showVedio(() => {

        }, (result) => {
            if (this.helpGrid != -1) {
                (this.gameView.gridList[this.helpGrid] as AwayGridView).effect = false;
            }
            if (result.finish) {
                this.helpGrid = AIController.getInstance().AIPlayGame();
                (this.gameView.gridList[this.helpGrid] as AwayGridView).effect = true;
            }
        }, "机器提示");
    }

    private onShowGuide(e) {
        GuideController.getInstance().startGuide(GuideEnum.GUIDE_TYPE_AWAY);
        // this.guide_view.setType(GuideEnum.GUIDE_TYPE_AWAY);
        // SceneManager.getInstance().getPopLayer().addChild(this.guide_view);
        // this.guide_view.setStep(0);
    }


    private onBackButtonTouched() {
        this.backButton.touchEnabled = false;
        SceneManager.getInstance().showTip(i18n.getLanguage(i18n.FLY_BACK_TIP))
        SceneManager.getInstance().toTechScene();
        // GameController.getInstance().gameFinished(false);
        // platform.analytics("giveUp", { bullet: RecordController.getInstance().getHitRecorded().length });
        // SceneManager.getInstance().toResultScene();
    }

    public inAnimate() {

        GameController.getInstance().record = false;
        this.backButton.touchEnabled = true;
        this.giveUpButton.touchEnabled = true;
        this.recordStopButton.visible = false;
        this.recordButton.visible = true;
        this.gameView = SceneManager.getInstance().storedGameView;
        this.addChild(this.gameView);
        egret.Tween.get(this.gameView).to({
            scaleX: 1, scaleY: 1, alpha: 1
        }, 500);
        if (!GuideController.getInstance().isAwayGuideFinished) {
            this.onShowGuide(null);
        }

        this.visible = true;
    }

    public outAnimate() {
        if (GameController.getInstance().record) {
            platform.stopRecord();
        }

        SceneManager.getInstance().storedGameView = this.gameView;
        this.visible = false;
    }

    public nextGuide() {
        this.updateMsg();
    }

    public updateMsg() {
        // this.messageView.updateView();
        this.progress.updateView();
    }

    public updateBullets() {
        // this.messageView.updateView();
        this.progress.updateView();
    }

    public resetGameView(mapOwner, isGuide = false) {
        SceneManager.getInstance().storedGameView.resetView();
        this.progress.setPlayer(mapOwner);
        this.progress.resetView();
    }

    // public hideGridView(gridId) {
    //     (this.gameView.gridList[gridId] as AwayGridView).status = GridStatusEnum.COVER;
    // }

    // //开炮的时候设置格子具体是什么
    // public showGridView(gridId, type, status = GridStatusEnum.SHOW) {
    //     (this.gameView.gridList[gridId] as AwayGridView).status = status;
    //     this.gameView.gridList[gridId].type = type;
    // }


    public showGameFinished() {

        SceneManager.getInstance().showTip(i18n.getLanguage(i18n.GAME_OVER));

        if (platform.hasVedioSDK) {

        } else {

        }


        egret.setTimeout(() => {
            SceneManager.getInstance().toResultScene();
        }, this, 2000);


    }

    public get msgView() {
        return this.progress;
    }

    public getGameView() {
        return this.gameView;
    }

}